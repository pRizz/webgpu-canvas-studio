import { useState } from 'react';
import { Play, Pencil, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserCreation } from '@/types/webgpu';
import { formatDistanceToNow } from 'date-fns';

interface CreationCardProps {
  creation: UserCreation;
  onSelect: (creation: UserCreation) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const CreationCard = ({ creation, onSelect, onRename, onDelete }: CreationCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(creation.name);

  const handleSave = () => {
    if (editName.trim()) {
      onRename(creation.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(creation.name);
    setIsEditing(false);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div
        className="relative aspect-video bg-muted overflow-hidden"
        onClick={() => !isEditing && onSelect(creation)}
      >
        {/* Code preview background */}
        <div className="absolute inset-0 bg-gradient-to-br from-card via-muted to-card flex items-center justify-center">
          <pre className="text-[6px] text-muted-foreground/40 overflow-hidden p-2 max-h-full font-mono">
            {creation.code.slice(0, 500)}
          </pre>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" variant="secondary" className="gap-2">
            <Play className="w-4 h-4" />
            Open
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleSave}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-1">{creation.name}</CardTitle>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDistanceToNow(creation.updatedAt, { addSuffix: true })}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Rename
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(creation.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
