
import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CodeBlockProps {
  code: string;
  language: string;
  onChange?: (code: string) => void;
  onExit?: () => void;
  onDelete?: () => void;
}

export function CodeBlock({ code: initialCode, language, onChange, onExit, onDelete }: CodeBlockProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      executeCode();
      if (onExit) {
        onExit();
      }
      // Move focus away from textarea
      textareaRef.current?.blur();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
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

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput(""); // Clear previous output
    
    try {
      // Mock execution for different languages
      let mockOutput = '';
      const executionDelay = 500; // Simulate execution time
      
      await new Promise(resolve => setTimeout(resolve, executionDelay));
      
      switch (language.toLowerCase()) {
        case 'python':
          // Simple Python code execution simulation
          const pythonLines = code.split('\n').filter(line => line.trim());
          mockOutput = pythonLines.map(line => {
            if (line.startsWith('print')) {
              return line.substring(6, line.length - 1); // Extract content inside print()
            }
            return `Executed: ${line}`;
          }).join('\n');
          break;
          
        case 'java':
          mockOutput = `Java Output:\n${code}\n\nProgram executed successfully!\nOutput:\nHello from Java!`;
          break;
          
        case 'c++':
          mockOutput = `C++ Output:\n${code}\n\nCompilation successful!\nOutput:\nHello from C++!`;
          break;
          
        case 'c':
          mockOutput = `C Output:\n${code}\n\nCompilation successful!\nOutput:\nHello from C!`;
          break;
          
        default:
          mockOutput = `Executed ${language} code:\n${code}\n\nOutput: Hello, World!`;
      }
      
      setOutput(mockOutput);
      toast({
        title: "Code executed successfully",
        description: "Your code has been run and the output is displayed below.",
      });
    } catch (error) {
      setOutput("Error executing code");
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
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={executeCode}
            disabled={isRunning}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      <div className="p-4 bg-accent/20">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[100px] bg-transparent outline-none font-mono text-sm"
          rows={Math.max(code.split('\n').length, 3)}
          spellCheck={false}
        />
      </div>
      {output && (
        <div className="p-4 border-t border-border bg-background">
          <h4 className="text-sm font-medium mb-2">Output:</h4>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-accent/20 p-3 rounded-md">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
