import { useState } from 'react';
import { Sparkles, Box, Flame, FolderHeart } from 'lucide-react';
import { FooterSection } from './FooterSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExampleCard } from './ExampleCard';
import { CreationCard } from './CreationCard';
import { shaderExamples, getExamplesByCategory } from '@/data/examples';
import { ShaderExample, UserCreation } from '@/types/webgpu';

interface GalleryProps {
  creations: UserCreation[];
  onSelectExample: (example: ShaderExample) => void;
  onSelectCreation: (creation: UserCreation) => void;
  onForkExample: (example: ShaderExample) => void;
  onRenameCreation: (id: string, name: string) => void;
  onDeleteCreation: (id: string) => void;
}

export const Gallery = ({
  creations,
  onSelectExample,
  onSelectCreation,
  onForkExample,
  onRenameCreation,
  onDeleteCreation,
}: GalleryProps) => {
  const [activeTab, setActiveTab] = useState('all');

  const shaders = getExamplesByCategory('shader');
  const graphics3d = getExamplesByCategory('3d');
  const particles = getExamplesByCategory('particles');

  const renderExamples = (examples: ShaderExample[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {examples.map((example) => (
        <ExampleCard
          key={example.id}
          example={example}
          onSelect={onSelectExample}
          onFork={onForkExample}
        />
      ))}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 overflow-auto h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All Examples
          </TabsTrigger>
          <TabsTrigger
            value="shaders"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Visual Shaders
          </TabsTrigger>
          <TabsTrigger
            value="3d"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Box className="w-4 h-4 mr-2" />
            3D Graphics
          </TabsTrigger>
          <TabsTrigger
            value="particles"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Flame className="w-4 h-4 mr-2" />
            Particles
          </TabsTrigger>
          <TabsTrigger
            value="creations"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FolderHeart className="w-4 h-4 mr-2" />
            My Creations
            {creations.length > 0 && (
              <span className="ml-2 bg-muted rounded-full px-2 py-0.5 text-xs">
                {creations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Visual Shaders
              </h2>
              {renderExamples(shaders)}
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-accent" />
                3D Graphics
              </h2>
              {renderExamples(graphics3d)}
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-destructive" />
                Particle Systems
              </h2>
              {renderExamples(particles)}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="shaders" className="mt-0">
          {renderExamples(shaders)}
        </TabsContent>

        <TabsContent value="3d" className="mt-0">
          {renderExamples(graphics3d)}
        </TabsContent>

        <TabsContent value="particles" className="mt-0">
          {renderExamples(particles)}
        </TabsContent>

        <TabsContent value="creations" className="mt-0">
          {creations.length === 0 ? (
            <div className="text-center py-16">
              <FolderHeart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No creations yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Fork an example or create a new shader to get started. Your creations will be saved locally.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {creations.map((creation) => (
                <CreationCard
                  key={creation.id}
                  creation={creation}
                  onSelect={onSelectCreation}
                  onRename={onRenameCreation}
                  onDelete={onDeleteCreation}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <FooterSection />
    </div>
  );
};
