// WebGPU Type Declarations
// These types augment the standard Navigator and HTMLCanvasElement interfaces

interface GPU {
  requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
  getPreferredCanvasFormat(): GPUTextureFormat;
}

interface GPURequestAdapterOptions {
  powerPreference?: 'low-power' | 'high-performance';
}

interface GPUAdapter {
  requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
  requestAdapterInfo(): Promise<GPUAdapterInfo>;
}

interface GPUAdapterInfo {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
}

interface GPUDeviceDescriptor {
  requiredFeatures?: GPUFeatureName[];
  requiredLimits?: Record<string, number>;
}

type GPUFeatureName = string;

interface GPUDevice {
  createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule;
  createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline;
  createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer;
  createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup;
  createCommandEncoder(): GPUCommandEncoder;
  queue: GPUQueue;
  destroy(): void;
}

interface GPUShaderModuleDescriptor {
  code: string;
  label?: string;
}

interface GPUShaderModule {
  getCompilationInfo(): Promise<GPUCompilationInfo>;
}

interface GPUCompilationInfo {
  messages: GPUCompilationMessage[];
}

interface GPUCompilationMessage {
  message: string;
  type: 'error' | 'warning' | 'info';
  lineNum: number;
  linePos: number;
}

interface GPURenderPipelineDescriptor {
  layout: 'auto' | GPUPipelineLayout;
  vertex: GPUVertexState;
  fragment?: GPUFragmentState;
  primitive?: GPUPrimitiveState;
}

interface GPUPipelineLayout {}

interface GPUVertexState {
  module: GPUShaderModule;
  entryPoint: string;
  buffers?: GPUVertexBufferLayout[];
}

interface GPUVertexBufferLayout {}

interface GPUFragmentState {
  module: GPUShaderModule;
  entryPoint: string;
  targets: GPUColorTargetState[];
}

interface GPUColorTargetState {
  format: GPUTextureFormat;
}

type GPUTextureFormat = string;

interface GPUPrimitiveState {
  topology?: 'point-list' | 'line-list' | 'line-strip' | 'triangle-list' | 'triangle-strip';
}

interface GPURenderPipeline {
  getBindGroupLayout(index: number): GPUBindGroupLayout;
}

interface GPUBindGroupLayout {}

interface GPUBufferDescriptor {
  size: number;
  usage: number;
  mappedAtCreation?: boolean;
}

interface GPUBuffer {
  destroy(): void;
}

declare const GPUBufferUsage: {
  MAP_READ: number;
  MAP_WRITE: number;
  COPY_SRC: number;
  COPY_DST: number;
  INDEX: number;
  VERTEX: number;
  UNIFORM: number;
  STORAGE: number;
  INDIRECT: number;
  QUERY_RESOLVE: number;
};

interface GPUBindGroupDescriptor {
  layout: GPUBindGroupLayout;
  entries: GPUBindGroupEntry[];
}

interface GPUBindGroupEntry {
  binding: number;
  resource: GPUBindingResource;
}

type GPUBindingResource = { buffer: GPUBuffer } | GPUSampler | GPUTextureView;

interface GPUSampler {}
interface GPUTextureView {}

interface GPUBindGroup {}

interface GPUCommandEncoder {
  beginRenderPass(descriptor: GPURenderPassDescriptor): GPURenderPassEncoder;
  finish(): GPUCommandBuffer;
}

interface GPURenderPassDescriptor {
  colorAttachments: (GPURenderPassColorAttachment | null)[];
}

interface GPURenderPassColorAttachment {
  view: GPUTextureView;
  clearValue?: { r: number; g: number; b: number; a: number };
  loadOp: 'load' | 'clear';
  storeOp: 'store' | 'discard';
}

interface GPURenderPassEncoder {
  setPipeline(pipeline: GPURenderPipeline): void;
  setBindGroup(index: number, bindGroup: GPUBindGroup): void;
  draw(vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number): void;
  end(): void;
}

interface GPUCommandBuffer {}

interface GPUQueue {
  submit(commandBuffers: GPUCommandBuffer[]): void;
  writeBuffer(buffer: GPUBuffer, bufferOffset: number, data: ArrayBuffer | ArrayBufferView): void;
}

interface GPUCanvasContext {
  configure(configuration: GPUCanvasConfiguration): void;
  unconfigure(): void;
  getCurrentTexture(): GPUTexture;
}

interface GPUCanvasConfiguration {
  device: GPUDevice;
  format: GPUTextureFormat;
  alphaMode?: 'opaque' | 'premultiplied';
}

interface GPUTexture {
  createView(): GPUTextureView;
}

interface Navigator {
  gpu?: GPU;
}

interface HTMLCanvasElement {
  getContext(contextId: 'webgpu'): GPUCanvasContext | null;
}
