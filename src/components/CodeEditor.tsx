import { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  className?: string;
}

export const CodeEditor = ({ code, onChange, className }: CodeEditorProps) => {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register WGSL language if not already registered
    if (!monaco.languages.getLanguages().some((lang: any) => lang.id === 'wgsl')) {
      monaco.languages.register({ id: 'wgsl' });

      monaco.languages.setMonarchTokensProvider('wgsl', {
        keywords: [
          'fn', 'let', 'var', 'const', 'if', 'else', 'for', 'while', 'loop',
          'break', 'continue', 'return', 'struct', 'true', 'false',
          'discard', 'switch', 'case', 'default', 'fallthrough',
        ],
        typeKeywords: [
          'bool', 'i32', 'u32', 'f32', 'f16',
          'vec2', 'vec3', 'vec4',
          'mat2x2', 'mat3x3', 'mat4x4',
          'array', 'ptr', 'sampler', 'texture_2d',
        ],
        operators: [
          '=', '>', '<', '!', '~', '?', ':',
          '==', '<=', '>=', '!=', '&&', '||', '++', '--',
          '+', '-', '*', '/', '&', '|', '^', '%', '<<', '>>', '>>>', '+=', '-=', '*=', '/=',
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        tokenizer: {
          root: [
            [/@[a-zA-Z_]\w*/, 'annotation'],
            [/[a-z_$][\w$]*/, {
              cases: {
                '@typeKeywords': 'type',
                '@keywords': 'keyword',
                '@default': 'identifier'
              }
            }],
            [/[A-Z][\w\$]*/, 'type.identifier'],
            { include: '@whitespace' },
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
              cases: {
                '@operators': 'operator',
                '@default': ''
              }
            }],
            [/\d*\.\d+([eE][\-+]?\d+)?[fh]?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+[iu]?/, 'number.hex'],
            [/\d+[iu]?/, 'number'],
            [/[;,.]/, 'delimiter'],
          ],
          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
          ],
          comment: [
            [/[^\/*]+/, 'comment'],
            [/\/\*/, 'comment', '@push'],
            ['\\*/', 'comment', '@pop'],
            [/[\/*]/, 'comment']
          ],
        },
      });
    }

    // Define custom themes
    monaco.editor.defineTheme('webgpu-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'annotation', foreground: '00ffaa' },
        { token: 'keyword', foreground: '00d4ff' },
        { token: 'type', foreground: 'ff6b9d' },
        { token: 'number', foreground: 'ffcc00' },
        { token: 'comment', foreground: '6a737d' },
        { token: 'string', foreground: '98c379' },
      ],
      colors: {
        'editor.background': '#0a0f14',
        'editor.foreground': '#00ff88',
        'editorLineNumber.foreground': '#3a4a5a',
        'editor.selectionBackground': '#264f78',
        'editor.lineHighlightBackground': '#0d1318',
      },
    });

    monaco.editor.defineTheme('webgpu-modern', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'annotation', foreground: '2563eb' },
        { token: 'keyword', foreground: '7c3aed' },
        { token: 'type', foreground: 'db2777' },
        { token: 'number', foreground: 'c2410c' },
        { token: 'comment', foreground: '9ca3af' },
      ],
      colors: {
        'editor.background': '#f8fafc',
        'editor.foreground': '#1e293b',
        'editorLineNumber.foreground': '#94a3b8',
        'editor.selectionBackground': '#dbeafe',
        'editor.lineHighlightBackground': '#f1f5f9',
      },
    });

    monaco.editor.defineTheme('webgpu-colorful', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'annotation', foreground: 'ffcc00' },
        { token: 'keyword', foreground: 'ff66cc' },
        { token: 'type', foreground: '66ccff' },
        { token: 'number', foreground: 'ffaa00' },
        { token: 'comment', foreground: '8b7db3' },
      ],
      colors: {
        'editor.background': '#1a1025',
        'editor.foreground': '#fffacd',
        'editorLineNumber.foreground': '#6b5b8a',
        'editor.selectionBackground': '#4a2c6a',
        'editor.lineHighlightBackground': '#221530',
      },
    });
  };

  // Update theme when it changes
  useEffect(() => {
    if (editorRef.current) {
      const monacoTheme = theme === 'dark' ? 'webgpu-dark' 
        : theme === 'modern' ? 'webgpu-modern' 
        : 'webgpu-colorful';
      editorRef.current.updateOptions({ theme: monacoTheme });
    }
  }, [theme]);

  const monacoTheme = theme === 'dark' ? 'webgpu-dark' 
    : theme === 'modern' ? 'webgpu-modern' 
    : 'webgpu-colorful';

  return (
    <div className={className}>
      <Editor
        height="100%"
        language="wgsl"
        theme={monacoTheme}
        value={code}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          tabSize: 2,
        }}
      />
    </div>
  );
};
