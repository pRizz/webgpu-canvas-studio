export interface ShaderExample {
  id: string;
  title: string;
  description: string;
  category: 'shader' | '3d' | 'particles';
  code: string;
  thumbnail?: string;
}

export interface UserCreation {
  id: string;
  name: string;
  code: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
}

export interface PerformanceStats {
  fps: number;
  frameTime: number;
  gpuInfo: string;
}

export type ViewMode = 'gallery' | 'canvas' | 'split';

export interface PlaybackState {
  isPlaying: boolean;
  speed: number;
  time: number;
}
