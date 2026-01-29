import { useState, useCallback } from 'react';
import { Save, ArrowLeft, Code, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Header } from './Header';
import { Canvas } from './Canvas';
import { CodeEditor } from './CodeEditor';
import { Gallery } from './Gallery';
import { WebGPUNotSupported } from './WebGPUNotSupported';
import { useCreations } from '@/hooks/useCreations';
import { defaultShaderCode } from '@/data/examples';
import { ViewMode, PlaybackState, ShaderExample, UserCreation } from '@/types/webgpu';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export const Playground = () => {
  // Check WebGPU support
  const isWebGPUSupported = !!(navigator as any).gpu;

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [showEditor, setShowEditor] = useState(false);

  // Current code state
  const [currentCode, setCurrentCode] = useState(defaultShaderCode);
  const [currentCreationId, setCurrentCreationId] = useState<string | null>(null);
  const [currentExampleName, setCurrentExampleName] = useState<string | null>(null);

  // Playback state
  const [playback, setPlayback] = useState<PlaybackState>({
    isPlaying: true,
    speed: 1,
    time: 0,
  });

  // Save dialog state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  // Creations management
  const {
    creations,
    addCreation,
    updateCreation,
    deleteCreation,
    forkExample,
  } = useCreations();

  // Handlers
  const handlePlaybackChange = useCallback((changes: Partial<PlaybackState>) => {
    setPlayback((prev) => ({ ...prev, ...changes }));
  }, []);

  const handleSelectExample = useCallback((example: ShaderExample) => {
    setCurrentCode(example.code);
    setCurrentCreationId(null);
    setCurrentExampleName(example.title);
    setViewMode('canvas');
    setPlayback((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const handleSelectCreation = useCallback((creation: UserCreation) => {
    setCurrentCode(creation.code);
    setCurrentCreationId(creation.id);
    setCurrentExampleName(null);
    setViewMode('canvas');
    setPlayback((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const handleForkExample = useCallback((example: ShaderExample) => {
    const newCreation = forkExample(example.title, example.code);
    toast({
      title: 'Example forked!',
      description: `"${newCreation.name}" has been added to your creations.`,
    });
  }, [forkExample]);

  const handleNewCreation = useCallback(() => {
    setCurrentCode(defaultShaderCode);
    setCurrentCreationId(null);
    setCurrentExampleName(null);
    setViewMode('split');
    setShowEditor(true);
  }, []);

  const handleSave = useCallback(() => {
    if (currentCreationId) {
      // Update existing creation
      updateCreation(currentCreationId, { code: currentCode });
      toast({
        title: 'Saved!',
        description: 'Your changes have been saved.',
      });
    } else {
      // Open save dialog for new creation
      setSaveName(currentExampleName ? `${currentExampleName} (Modified)` : 'My Shader');
      setSaveDialogOpen(true);
    }
  }, [currentCreationId, currentCode, currentExampleName, updateCreation]);

  const handleSaveNew = useCallback(() => {
    if (!saveName.trim()) return;
    
    const newCreation = addCreation(saveName.trim(), currentCode);
    setCurrentCreationId(newCreation.id);
    setCurrentExampleName(null);
    setSaveDialogOpen(false);
    toast({
      title: 'Saved!',
      description: `"${saveName.trim()}" has been created.`,
    });
  }, [saveName, currentCode, addCreation]);

  const handleRenameCreation = useCallback((id: string, name: string) => {
    updateCreation(id, { name });
    toast({
      title: 'Renamed!',
      description: `Creation renamed to "${name}".`,
    });
  }, [updateCreation]);

  const handleDeleteCreation = useCallback((id: string) => {
    deleteCreation(id);
    if (currentCreationId === id) {
      setCurrentCreationId(null);
      setCurrentCode(defaultShaderCode);
      setViewMode('gallery');
    }
    toast({
      title: 'Deleted',
      description: 'Creation has been removed.',
    });
  }, [deleteCreation, currentCreationId]);

  const handleBackToGallery = useCallback(() => {
    setViewMode('gallery');
    setShowEditor(false);
  }, []);

  if (!isWebGPUSupported) {
    return <WebGPUNotSupported />;
  }

  return (
    <div className="h-screen flex flex-col bg-background theme-transition overflow-hidden">
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewCreation={handleNewCreation}
      />

      <main className="flex-1 overflow-hidden">
        {viewMode === 'gallery' ? (
          <Gallery
            creations={creations}
            onSelectExample={handleSelectExample}
            onSelectCreation={handleSelectCreation}
            onForkExample={handleForkExample}
            onRenameCreation={handleRenameCreation}
            onDeleteCreation={handleDeleteCreation}
          />
        ) : viewMode === 'canvas' ? (
          <div className="relative h-full">
            <Canvas
              code={currentCode}
              playback={playback}
              onPlaybackChange={handlePlaybackChange}
              className="h-full"
            />

            {/* Floating controls */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBackToGallery}
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Gallery
              </Button>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowEditor(!showEditor)}
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              >
                <Code className="w-4 h-4 mr-2" />
                {showEditor ? 'Hide Code' : 'Show Code'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSave}
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>

            {/* Slide-in editor */}
            <div
              className={cn(
                'absolute top-0 right-0 h-full w-full sm:w-1/2 lg:w-2/5 bg-card border-l border-border transition-transform duration-300',
                showEditor ? 'translate-x-0' : 'translate-x-full'
              )}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border-border">
                  <span className="font-semibold text-sm">
                    {currentExampleName || 
                     (currentCreationId && creations.find(c => c.id === currentCreationId)?.name) ||
                     'New Shader'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowEditor(false)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <CodeEditor
                  code={currentCode}
                  onChange={setCurrentCode}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        ) : (
          // Split view
          <div className="h-full flex">
            <div className="w-1/2 border-r border-border flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToGallery}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Gallery
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentExampleName || 
                     (currentCreationId && creations.find(c => c.id === currentCreationId)?.name) ||
                     'New Shader'}
                  </span>
                </div>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
              <CodeEditor
                code={currentCode}
                onChange={setCurrentCode}
                className="flex-1"
              />
            </div>
            <div className="w-1/2">
              <Canvas
                code={currentCode}
                playback={playback}
                onPlaybackChange={handlePlaybackChange}
                className="h-full"
              />
            </div>
          </div>
        )}
      </main>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Creation</DialogTitle>
            <DialogDescription>
              Give your shader a name to save it to your creations.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="My Awesome Shader"
            onKeyDown={(e) => e.key === 'Enter' && handleSaveNew()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNew} disabled={!saveName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
