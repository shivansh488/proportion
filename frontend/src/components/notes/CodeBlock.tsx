import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AISuggestions } from './AISuggestions'; // Import suggestions component

interface CodeBlockProps {
  id: string;
  code: string;
  language: string;
  isRunning?: boolean;
  output?: string;
  error?: string;
  onChange?: (code: string) => void;
  onDelete?: () => void;
  onRun?: (blockId: string) => Promise<void>;
}

export function CodeBlock({ 
  id,
  code: initialCode, 
  language, 
  isRunning = false,
  output: initialOutput = "",
  error: initialError = "",
  onChange, 
  onDelete,
  onRun 
}: CodeBlockProps) {
  const [code, setCode] = useState(initialCode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      if (onRun) {
        onRun(id);
      }
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

  return (
    <div className="my-4 rounded-lg border border-border">
      <div className="flex items-center justify-between bg-accent/50 px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium">{language}</span>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onRun?.(id)} disabled={isRunning} className="gap-2">
            <Play className="h-4 w-4" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete} className="gap-2">
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
        
        {/* AI Suggestions component */}
        <AISuggestions onSelect={(suggestion) => {
          const newCode = code + "\n" + suggestion.content; // Append suggestion
          setCode(newCode);
          if (onChange) {
            onChange(newCode);
          }
        }} />
      </div>

      {(initialOutput || initialError) && (
        <div className="p-4 border-t border-border bg-background">
          <h4 className="text-sm font-medium mb-2">Output:</h4>
          <pre className={`text-sm whitespace-pre-wrap p-3 rounded-md ${
            initialError ? 'text-destructive bg-destructive/20' : 'text-muted-foreground bg-accent/20'
          }`}>
            {initialError || initialOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
