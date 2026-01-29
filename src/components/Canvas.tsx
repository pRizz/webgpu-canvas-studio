import { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useWebGPU } from '@/hooks/useWebGPU';
import { PlaybackState } from '@/types/webgpu';
import { cn } from '@/lib/utils';

interface CanvasProps {
  code: string;
  playback: PlaybackState;
  onPlaybackChange: (playback: Partial<PlaybackState>) => void;
  showStats?: boolean;
  className?: string;
}

export const Canvas = ({
  code,
  playback,
  onPlaybackChange,
  showStats = true,
  className,
}: CanvasProps) => {
  const { canvasRef, error, stats, isSupported } = useWebGPU({ code, playback });
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);

  const handleReset = () => {
    onPlaybackChange({ time: 0 });
  };

  const handleScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `webgpu-screenshot-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setShowControls(true));
      container.addEventListener('mouseleave', () => setShowControls(false));
    }

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-black rounded-lg overflow-hidden', className)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-destructive/20 border border-destructive rounded-lg p-4 max-w-lg">
            <h3 className="text-destructive font-semibold mb-2">Shader Error</h3>
            <pre className="text-sm text-destructive/80 whitespace-pre-wrap font-mono">
              {error}
            </pre>
          </div>
        </div>
      )}

      {/* Stats Overlay */}
      {showStats && !error && (
        <div
          className={cn(
            'absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-md px-3 py-2 text-xs font-mono transition-opacity duration-300',
            showControls ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="flex items-center gap-4 text-foreground/80">
            <span>FPS: {stats.fps}</span>
            <span>Frame: {stats.frameTime.toFixed(2)}ms</span>
            {stats.gpuInfo && <span className="hidden sm:inline">{stats.gpuInfo}</span>}
          </div>
        </div>
      )}

      {/* Playback Controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPlaybackChange({ isPlaying: !playback.isPlaying })}
            className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            {playback.isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-white/60 w-12">Speed</span>
            <Slider
              value={[playback.speed]}
              onValueChange={([value]) => onPlaybackChange({ speed: value })}
              min={0.1}
              max={3}
              step={0.1}
              className="flex-1 max-w-[200px]"
            />
            <span className="text-xs text-white/60 w-10">{playback.speed.toFixed(1)}x</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleScreenshot}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
