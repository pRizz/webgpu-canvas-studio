import { ThemeProvider } from '@/contexts/ThemeContext';
import { Playground } from '@/components/Playground';

const Index = () => {
  return (
    <ThemeProvider>
      <Playground />
    </ThemeProvider>
  );
};

export default Index;
