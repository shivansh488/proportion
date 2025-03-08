import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  output?: string;
  error?: string;
  isRunning?: boolean;
}

interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
}

export function useCodeBlocks() {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSupportedLanguages = async () => {
      setIsLoadingLanguages(true);
      try {
        const response = await fetch('/piston/runtimes');
        if (!response.ok) {
          throw new Error('Failed to fetch languages');
        }
        const data: PistonRuntime[] = await response.json();
        const languages = Array.from(new Set(
          data.flatMap(runtime => [runtime.language, ...runtime.aliases])
        )).sort();
        setSupportedLanguages(languages);
      } catch (error) {
        console.error('Failed to fetch supported languages:', error);
        toast({
          title: "Error",
          description: "Failed to fetch supported languages. Using default list.",
          variant: "destructive"
        });
        setSupportedLanguages(['python', 'javascript', 'typescript', 'java', 'c', 'cpp']);
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    fetchSupportedLanguages();
  }, [toast]);

  const insertCodeBlock = (language: string) => {
    const defaultCode = language === 'python' 
      ? 'print("Hello, World!")\n# Add your code here'
      : language === 'java'
      ? 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'
      : language === 'cpp'
      ? '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}'
      : language === 'c'
      ? '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'
      : language === 'javascript'
      ? 'console.log("Hello, World!");\n// Add your code here'
      : language === 'typescript'
      ? 'console.log("Hello, World!");\n// Add your code here'
      : '// Add your code here';
    
    const newCodeBlock = {
      id: Math.random().toString(36).substr(2, 9),
      language,
      code: defaultCode
    };
    
    setCodeBlocks(prev => [...prev, newCodeBlock]);

    toast({
      title: "Block inserted",
      description: `A new ${language} code block has been added.`,
    });
  };

  const handleDeleteCodeBlock = (blockId: string) => {
    setCodeBlocks(prev => prev.filter(block => block.id !== blockId));
    toast({
      title: "Block deleted",
      description: "The code block has been removed.",
    });
  };

  const handleCodeChange = (blockId: string, newCode: string) => {
    setCodeBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, code: newCode } : block
    ));
  };

  const runCode = async (blockId: string) => {
    const block = codeBlocks.find(b => b.id === blockId);
    if (!block) return;

    setCodeBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, isRunning: true, output: undefined, error: undefined } : b
    ));

    try {
      const response = await fetch('/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: block.language,
          version: '*',
          files: [
            {
              content: block.code
            }
          ],
          stdin: '',
          args: []
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.run?.stderr) {
        setCodeBlocks(prev => prev.map(b => 
          b.id === blockId ? {
            ...b,
            isRunning: false,
            error: data.run.stderr
          } : b
        ));
        toast({
          title: "Error executing code",
          description: "There was an error running your code.",
          variant: "destructive"
        });
        return;
      }

      setCodeBlocks(prev => prev.map(b => 
        b.id === blockId ? {
          ...b,
          isRunning: false,
          output: data.run.stdout,
          error: undefined
        } : b
      ));

      toast({
        title: "Code executed",
        description: "Your code ran successfully",
      });
    } catch (error) {
      console.error('Failed to execute code:', error);
      setCodeBlocks(prev => prev.map(b => 
        b.id === blockId ? {
          ...b,
          isRunning: false,
          error: 'Failed to execute code. Please try again.'
        } : b
      ));
      toast({
        title: "Error",
        description: "Failed to execute code. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    codeBlocks,
    supportedLanguages,
    isLoadingLanguages,
    insertCodeBlock,
    handleDeleteCodeBlock,
    handleCodeChange,
    runCode,
  };
}
