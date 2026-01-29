import { Palette, Plus, Grid3X3, Maximize2, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme, ThemeType } from '@/contexts/ThemeContext';
import { ViewMode } from '@/types/webgpu';
import { cn } from '@/lib/utils';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNewCreation: () => void;
}

const themes: { value: ThemeType; label: string; description: string }[] = [
  { value: 'dark', label: 'Dark & Technical', description: 'Terminal aesthetic with cyan accents' },
  { value: 'modern', label: 'Modern & Clean', description: 'Minimal design with soft shadows' },
  { value: 'colorful', label: 'Colorful & Playful', description: 'Vibrant gradients and fun animations' },
];

export const Header = ({ viewMode, onViewModeChange, onNewCreation }: HeaderProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 theme-transition">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">W</span>
        </div>
        <h1 className="font-display font-bold text-lg hidden sm:block">WebGPU Playground</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 px-3 rounded-md',
              viewMode === 'gallery' && 'bg-background shadow-sm'
            )}
            onClick={() => onViewModeChange('gallery')}
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Gallery</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 px-3 rounded-md',
              viewMode === 'canvas' && 'bg-background shadow-sm'
            )}
            onClick={() => onViewModeChange('canvas')}
          >
            <Maximize2 className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Canvas</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 px-3 rounded-md',
              viewMode === 'split' && 'bg-background shadow-sm'
            )}
            onClick={() => onViewModeChange('split')}
          >
            <Columns className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Split</span>
          </Button>
        </div>

        {/* Theme Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Palette className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {themes.map((t) => (
              <DropdownMenuItem
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  'flex flex-col items-start gap-1 cursor-pointer',
                  theme === t.value && 'bg-accent'
                )}
              >
                <span className="font-medium">{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Creation Button */}
        <Button onClick={onNewCreation} className="glow-primary">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">New</span>
        </Button>
      </div>
    </header>
  );
};
