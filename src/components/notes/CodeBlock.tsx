import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const executeCode = async () => {
    setIsRunning(true);
    try {
      // For demo purposes, we'll just show a mock execution
      // In production, this would connect to a code execution API
      setTimeout(() => {
        setOutput(`Executed ${language} code:\n${code}\n\nOutput: Hello, World!`);
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
      <pre className="p-4 bg-accent/20 overflow-x-auto">
        <code>{code}</code>
      </pre>
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