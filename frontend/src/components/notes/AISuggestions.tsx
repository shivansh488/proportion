
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AISuggestions({ editorContent }: { editorContent?: string }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!editorContent) {
      toast({
        title: "No content",
        description: "Please add some content to your note first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-suggestions', {
        body: { content: editorContent }
      });

      if (error) throw error;

      setSuggestions(data.suggestions);
      toast({
        title: "Suggestions generated",
        description: "AI has analyzed your note and provided suggestions.",
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error generating suggestions",
        description: "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80">
      <Button
        onClick={generateSuggestions}
        disabled={isLoading}
        className="mb-2 w-full gap-2"
      >
        <Sparkles className="h-4 w-4" />
        {isLoading ? 'Generating...' : 'Get AI Suggestions'}
      </Button>
      {suggestions.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Suggestions</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSuggestions([])}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer p-2 rounded-md hover:bg-accent/50 transition-colors"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
