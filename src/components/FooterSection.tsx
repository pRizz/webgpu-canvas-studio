import { Github, Linkedin, Twitter, BookOpen } from "lucide-react";
import { LINKEDIN_URL, TWITTER_URL, GITHUB_URL, MEDIUM_URL } from "@/lib/constants";

export const FooterSection = (): JSX.Element => {
  return (
    <footer
      className="text-center py-6 text-sm text-muted-foreground space-y-3 border-t border-border/50"
      aria-label="Footer information"
    >
      <p>
        <a
          href="https://gpu-canvas-play.lovable.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          gpu-canvas-play.lovable.app
        </a>
        {" · "}
        <a
          href="https://github.com/pRizz/webgpu-canvas-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Open Source
        </a>
      </p>
      <p className="text-xs">
        Made by{" "}
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-primary hover:underline transition-colors"
        >
          Peter Ryszkiewicz
        </a>{" "}
        with{" "}
        <a
          href="https://lovable.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Lovable
        </a>
      </p>
      <div className="flex items-center justify-center gap-4 mt-2">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>
        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="Twitter/X"
        >
          <Twitter className="h-4 w-4" />
        </a>
        <a
          href={MEDIUM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="Medium"
        >
          <BookOpen className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
};
