import { GitFork, Play, Sparkles, Box, Flame } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShaderExample } from '@/types/webgpu';
import { CanvasPreview } from './CanvasPreview';
import { cn } from '@/lib/utils';

interface ExampleCardProps {
  example: ShaderExample;
  onSelect: (example: ShaderExample) => void;
  onFork: (example: ShaderExample) => void;
}

const categoryIcons = {
  shader: Sparkles,
  '3d': Box,
  particles: Flame,
};

const categoryColors = {
  shader: 'bg-primary/20 text-primary border-primary/30',
  '3d': 'bg-accent/20 text-accent border-accent/30',
  particles: 'bg-destructive/20 text-destructive border-destructive/30',
};

const categoryLabels = {
  shader: 'Visual Shader',
  '3d': '3D Graphics',
  particles: 'Particles',
};

export const ExampleCard = ({ example, onSelect, onFork }: ExampleCardProps) => {
  const Icon = categoryIcons[example.category];

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 glow-primary cursor-pointer">
      <div
        className="relative aspect-video bg-black overflow-hidden"
        onClick={() => onSelect(example)}
      >
        {/* Live WebGPU canvas preview */}
        <CanvasPreview code={example.code} className="absolute inset-0" />
        
        {/* Fallback gradient if WebGPU fails - shown behind canvas */}
        <div className={cn(
          'absolute inset-0 flex items-center justify-center -z-10',
          example.category === 'shader' && 'bg-gradient-to-br from-primary/30 via-accent/20 to-secondary',
          example.category === '3d' && 'bg-gradient-to-br from-accent/30 via-primary/20 to-muted',
          example.category === 'particles' && 'bg-gradient-to-br from-destructive/30 via-accent/20 to-primary/10'
        )}>
          <Icon className="w-12 h-12 text-foreground/20" />
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" variant="secondary" className="gap-2">
            <Play className="w-4 h-4" />
            View
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-1">{example.title}</CardTitle>
          <Badge variant="outline" className={cn('shrink-0 text-xs', categoryColors[example.category])}>
            {categoryLabels[example.category]}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          {example.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onFork(example);
          }}
        >
          <GitFork className="w-4 h-4 mr-2" />
          Fork to My Creations
        </Button>
      </CardContent>
    </Card>
  );
};
