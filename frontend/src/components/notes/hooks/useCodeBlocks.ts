
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface CodeBlock {
  id: string;
  language: string;
  code: string;
}

export function useCodeBlocks() {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const { toast } = useToast();

  const insertCodeBlock = (language: string) => {
    const defaultCode = language === 'python' 
      ? 'print("Hello, World!")\n# Add your code here'
      : language === 'java'
      ? 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'
      : language === 'c++'
      ? '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}'
      : language === 'c'
      ? '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'
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

  return {
    codeBlocks,
    insertCodeBlock,
    handleDeleteCodeBlock,
    handleCodeChange,
  };
}
