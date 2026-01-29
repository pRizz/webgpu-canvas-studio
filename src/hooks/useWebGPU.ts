/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import { PerformanceStats, PlaybackState } from '@/types/webgpu';

interface UseWebGPUOptions {
  code: string;
  playback: PlaybackState;
}

interface UseWebGPUReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  error: string | null;
  stats: PerformanceStats;
  isSupported: boolean;
  gpuInfo: string;
}

// Type helpers for WebGPU (browser-only API)
const getGPU = (): any => (navigator as any).gpu;
const hasWebGPU = (): boolean => !!(navigator as any).gpu;

export const useWebGPU = ({ code, playback }: UseWebGPUOptions): UseWebGPUReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PerformanceStats>({ fps: 0, frameTime: 0, gpuInfo: '' });
  const [isSupported, setIsSupported] = useState(true);
  const [gpuInfo, setGpuInfo] = useState('');
  
  const deviceRef = useRef<any>(null);
  const contextRef = useRef<any>(null);
  const pipelineRef = useRef<any>(null);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsUpdateTimeRef = useRef<number>(0);

  // Check WebGPU support
  useEffect(() => {
    if (!hasWebGPU()) {
      setIsSupported(false);
      setError('WebGPU is not supported in this browser');
    }
  }, []);

  // Initialize WebGPU
  const initWebGPU = useCallback(async () => {
    if (!canvasRef.current || !hasWebGPU()) return;

    const gpu = getGPU();

    try {
      const adapter = await gpu.requestAdapter();
      if (!adapter) {
        throw new Error('Failed to get GPU adapter');
      }

      const device = await adapter.requestDevice();
      deviceRef.current = device;

      // requestAdapterInfo may not be available in all browsers
      let info = 'WebGPU';
      try {
        if (adapter.requestAdapterInfo) {
          const adapterInfo = await adapter.requestAdapterInfo();
          info = `${adapterInfo.vendor || 'GPU'} - ${adapterInfo.architecture || 'WebGPU'}`;
        }
      } catch {
        // Fallback if requestAdapterInfo fails
      }
      setGpuInfo(info);
      setStats(prev => ({ ...prev, gpuInfo: info }));

      const canvas = canvasRef.current;
      const context = canvas.getContext('webgpu') as any;
      if (!context) {
        throw new Error('Failed to get WebGPU context');
      }
      contextRef.current = context;

      const format = gpu.getPreferredCanvasFormat();
      context.configure({
        device,
        format,
        alphaMode: 'premultiplied',
      });

      return { device, context, format };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize WebGPU');
      return null;
    }
  }, []);

  // Compile and run shader
  const compileShader = useCallback(async (shaderCode: string) => {
    if (!deviceRef.current || !contextRef.current) return null;

    const device = deviceRef.current;
    const gpu = getGPU();
    const format = gpu.getPreferredCanvasFormat();

    try {
      // Create shader module
      const shaderModule = device.createShaderModule({
        code: shaderCode,
      });

      // Check for compilation errors
      const compilationInfo = await shaderModule.getCompilationInfo();
      const errors = compilationInfo.messages.filter((m: any) => m.type === 'error');
      if (errors.length > 0) {
        throw new Error(errors.map((e: any) => `Line ${e.lineNum}: ${e.message}`).join('\n'));
      }

      // Create render pipeline
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
      setError(null);
      return pipeline;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Shader compilation failed';
      setError(errorMessage);
      return null;
    }
  }, []);

  // Create uniform buffer for time
  const createUniformBuffer = useCallback((device: any) => {
    const GPUBufferUsageFlags = {
      UNIFORM: 0x0040,
      COPY_DST: 0x0008,
    };
    
    const uniformBuffer = device.createBuffer({
      size: 16, // 4 floats: time, resolution.x, resolution.y, speed
      usage: GPUBufferUsageFlags.UNIFORM | GPUBufferUsageFlags.COPY_DST,
    });
    return uniformBuffer;
  }, []);

  // Render frame
  const render = useCallback((time: number, uniformBuffer: any, bindGroup: any) => {
    if (!deviceRef.current || !contextRef.current || !pipelineRef.current || !canvasRef.current) return;

    const device = deviceRef.current;
    const context = contextRef.current;
    const pipeline = pipelineRef.current;
    const canvas = canvasRef.current;

    // Update uniforms
    const uniformData = new Float32Array([
      time * playback.speed,
      canvas.width,
      canvas.height,
      playback.speed,
    ]);
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    // Create command encoder
    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0); // Full-screen quad (2 triangles)
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
  }, [playback.speed]);

  // Animation loop
  useEffect(() => {
    if (!isSupported || !playback.isPlaying) return;

    let uniformBuffer: any = null;
    let bindGroup: any = null;

    const setup = async () => {
      const result = await initWebGPU();
      if (!result) return;

      const pipeline = await compileShader(code);
      if (!pipeline) return;

      uniformBuffer = createUniformBuffer(result.device);

      // Create bind group
      bindGroup = result.device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: uniformBuffer },
          },
        ],
      });

      startTimeRef.current = performance.now();
      lastFrameTimeRef.current = startTimeRef.current;
      frameCountRef.current = 0;
      fpsUpdateTimeRef.current = startTimeRef.current;

      const animate = (currentTime: number) => {
        if (!playback.isPlaying) return;

        const elapsed = (currentTime - startTimeRef.current) / 1000;
        const frameTime = currentTime - lastFrameTimeRef.current;
        lastFrameTimeRef.current = currentTime;
        frameCountRef.current++;

        // Update FPS every 500ms
        if (currentTime - fpsUpdateTimeRef.current >= 500) {
          const fps = Math.round((frameCountRef.current * 1000) / (currentTime - fpsUpdateTimeRef.current));
          setStats(prev => ({ ...prev, fps, frameTime: Math.round(frameTime * 100) / 100 }));
          frameCountRef.current = 0;
          fpsUpdateTimeRef.current = currentTime;
        }

        if (uniformBuffer && bindGroup) {
          render(elapsed, uniformBuffer, bindGroup);
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    setup();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [code, playback.isPlaying, isSupported, initWebGPU, compileShader, createUniformBuffer, render]);

  // Recompile on code change
  useEffect(() => {
    if (!isSupported || !deviceRef.current) return;
    compileShader(code);
  }, [code, isSupported, compileShader]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = Math.max(1, Math.floor(width * window.devicePixelRatio));
        canvas.height = Math.max(1, Math.floor(height * window.devicePixelRatio));
      }
    });

    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  return {
    canvasRef,
    error,
    stats,
    isSupported,
    gpuInfo,
  };
};
