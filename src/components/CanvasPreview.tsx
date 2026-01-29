import { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface CanvasPreviewProps {
  code: string;
  className?: string;
}

// Lightweight WebGPU preview - no stats, no controls, just renders
export const CanvasPreview = ({ code, className }: CanvasPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  
  const deviceRef = useRef<any>(null);
  const contextRef = useRef<any>(null);
  const pipelineRef = useRef<any>(null);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const mountedRef = useRef(true);

  const hasWebGPU = (): boolean => !!(navigator as any).gpu;
  const getGPU = (): any => (navigator as any).gpu;

  const initAndRender = useCallback(async () => {
    if (!canvasRef.current || !hasWebGPU()) {
      setError(true);
      return;
    }

    const gpu = getGPU();
    const canvas = canvasRef.current;

    try {
      // Initialize
      const adapter = await gpu.requestAdapter();
      if (!adapter || !mountedRef.current) return;

      const device = await adapter.requestDevice();
      if (!mountedRef.current) return;
      deviceRef.current = device;

      const context = canvas.getContext('webgpu') as any;
      if (!context) return;
      contextRef.current = context;

      const format = gpu.getPreferredCanvasFormat();
      context.configure({
        device,
        format,
        alphaMode: 'premultiplied',
      });

      // Compile shader
      const shaderModule = device.createShaderModule({ code });
      const compilationInfo = await shaderModule.getCompilationInfo();
      const errors = compilationInfo.messages.filter((m: any) => m.type === 'error');
      if (errors.length > 0) {
        setError(true);
        return;
      }

      const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
          module: shaderModule,
          entryPoint: 'vertexMain',
        },
        fragment: {
          module: shaderModule,
          entryPoint: 'fragmentMain',
          targets: [{ format }],
        },
        primitive: {
          topology: 'triangle-list',
        },
      });
      pipelineRef.current = pipeline;

      // Create uniform buffer
      const uniformBuffer = device.createBuffer({
        size: 16,
        usage: 0x0040 | 0x0008, // UNIFORM | COPY_DST
      });

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      });

      startTimeRef.current = performance.now();

      // Animation loop
      const animate = (currentTime: number) => {
        if (!mountedRef.current || !deviceRef.current || !contextRef.current || !pipelineRef.current) return;

        const elapsed = (currentTime - startTimeRef.current) / 1000;

        // Update uniforms
        const uniformData = new Float32Array([elapsed, canvas.width, canvas.height, 1.0]);
        device.queue.writeBuffer(uniformBuffer, 0, uniformData);

        // Render
        const commandEncoder = device.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();

        const renderPassDescriptor = {
          colorAttachments: [{
            view: textureView,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store',
          }],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();

        device.queue.submit([commandEncoder.finish()]);

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    } catch {
      setError(true);
    }
  }, [code]);

  useEffect(() => {
    mountedRef.current = true;
    initAndRender();

    return () => {
      mountedRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initAndRender]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Use lower resolution for thumbnails to save GPU
        canvas.width = Math.max(1, Math.floor(width));
        canvas.height = Math.max(1, Math.floor(height));
      }
    });

    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  if (error || !hasWebGPU()) {
    return null; // Will fall back to gradient in parent
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full', className)}
      style={{ display: 'block' }}
    />
  );
};
