import { AlertTriangle, Chrome, MonitorSmartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const WebGPUNotSupported = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-lg w-full glow-primary">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">WebGPU Not Supported</CardTitle>
          <CardDescription className="text-base">
            Your browser doesn't support WebGPU, the next-generation graphics API this playground uses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MonitorSmartphone className="w-5 h-5" />
              What is WebGPU?
            </h3>
            <p className="text-sm text-muted-foreground">
              WebGPU is a modern graphics API that provides high-performance 3D graphics and 
              data-parallel computation on the web. It's the successor to WebGL and offers 
              better performance and more features.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Chrome className="w-5 h-5" />
              Supported Browsers
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Chrome 113+ (recommended)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Edge 113+
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                Firefox Nightly (experimental)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                Safari 18+ (macOS Sonoma)
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">
                Download Chrome
              </a>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <a href="https://caniuse.com/webgpu" target="_blank" rel="noopener noreferrer">
                Check Browser Support
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
