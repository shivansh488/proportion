
import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CodeBlockProps {
  code: string;
  language: string;
  onChange?: (code: string) => void;
  onExit?: () => void;
}

export function CodeBlock({ code: initialCode, language, onChange, onExit }: CodeBlockProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      if (onExit) {
        onExit();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      // Set cursor position after timeout to ensure state is updated
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onChange) {
      onChange(newCode);
    }
  };

  const executeCode = async () => {
    setIsRunning(true);
    try {
      // Mock execution for different languages
      let mockOutput = '';
      switch (language.toLowerCase()) {
        case 'python':
          mockOutput = `Python Output:\n${code}\n\nOutput: Hello from Python!`;
          break;
        case 'java':
          mockOutput = `Java Output:\n${code}\n\nOutput: Hello from Java!`;
          break;
        case 'c++':
          mockOutput = `C++ Output:\n${code}\n\nOutput: Hello from C++!`;
          break;
        case 'c':
          mockOutput = `C Output:\n${code}\n\nOutput: Hello from C!`;
          break;
        default:
          mockOutput = `Executed ${language} code:\n${code}\n\nOutput: Hello, World!`;
      }
      
      setTimeout(() => {
        setOutput(mockOutput);
        toast({
          title: "Code executed successfully",
          description: "Your code has been run and the output is displayed below.",
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Error executing code",
        description: "There was an error running your code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="my-4 rounded-lg border border-border">
      <div className="flex items-center justify-between bg-accent/50 px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium">{language}</span>
        <Button
          size="sm"
          onClick={executeCode}
          disabled={isRunning}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          Run
        </Button>
      </div>
      <div className="p-4 bg-accent/20">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none font-mono text-sm"
          rows={code.split('\n').length}
          spellCheck={false}
        />
      </div>
      {output && (
        <div className="p-4 border-t border-border bg-background">
          <h4 className="text-sm font-medium mb-2">Output:</h4>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
