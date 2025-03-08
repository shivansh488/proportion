import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, X, Plus, Bold, Type } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Input } from "@/components/ui/input";
import { Editor } from '@tiptap/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GEMINI_API_KEY = 'AIzaSyDD8pBXUltQpvkeQSzMDkaujIfuBUEEanU';

const DEFAULT_PROMPTS = {
  'improve': 'Provide 3 suggestions to improve this content',
  'grammar': 'Check for grammatical errors and provide corrections',
  'explain': 'Explain the main concepts in simpler terms',
  'summarize': 'Provide a concise summary of this content',
  'custom': 'Custom prompt...'
};

interface AISuggestionsProps {
  editorContent?: string; // Make it optional
  editor?: Editor; // Use the Editor type from @tiptap/react
  onSelect?: (suggestion: { title: string; content: string }) => void;
  onInsertAtCursor?: (suggestion: string) => void; // New callback for inserting at cursor
}

export function AISuggestions({ editorContent, editor, onSelect, onInsertAtCursor }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptType, setPromptType] = useState<keyof typeof DEFAULT_PROMPTS>('improve');
  const [customPrompt, setCustomPrompt] = useState('');
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
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });

      const cleanContent = editorContent.replace(/<[^>]*>/g, '').slice(0, 1000);
      const prompt = promptType === 'custom' ? customPrompt : DEFAULT_PROMPTS[promptType];

      const result = await model.generateContent([
        `${prompt} for the following content: "${cleanContent}".
         Format each point as "Title: Description" where Title is a single word or short phrase.
         Provide 3-5 points, each on a new line. Do not include numbers, bullets, or any special formatting.`
      ]);

      const response = await result.response;
      const text = response.text();
      console.log('Gemini API Response:', text);

      const suggestions = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('[') && !line.endsWith(']'));

      setSuggestions(suggestions);
      toast({
        title: "Analysis complete",
        description: "AI has analyzed your note content.",
      });
    } catch (error) {
      console.error('Error analyzing content:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatSuggestionText = (text: string) => {
    const cleanText = text
      .replace(/[\[\]",]/g, '')
      .replace(/^\s*\d+\.\s*/, '')
      .trim();
    
    const parts = cleanText.split(':');
    if (parts.length > 1) {
      const title = parts[0].trim();
      const content = parts.slice(1).join(':').trim();
      return {
        title,
        content
      };
    }
    return {
      title: '',
      content: cleanText
    };
  };

  const insertSuggestion = (suggestion: string) => {
    const formattedSuggestion = formatSuggestionText(suggestion);
    
    if (onSelect) {
      onSelect(formattedSuggestion); // Pass suggestion to the parent component
      return;
    }

    if (onInsertAtCursor) {
      onInsertAtCursor(formattedSuggestion.content); // Insert at cursor position
      return;
    }
  
    // Fallback: Insert into editor if available
    if (editor) {
      editor.chain()
        .focus()
        .insertContentAt(editor.state.selection.from, `
          <div class="my-6 p-4 bg-accent/20 rounded-lg">
            ${formattedSuggestion.title ? `<h4 class="text-lg font-bold mb-2 text-primary">${formattedSuggestion.title}</h4>` : ''}
            <p class="text-base leading-7 font-normal">${formattedSuggestion.content}</p>
          </div>
        `)
        .run();
      
      toast({
        title: "Suggestion inserted",
        description: "The suggestion has been added to your note.",
      });
    }
  };

  const insertAllSuggestions = () => {
    if (!editor || !suggestions.length) return;

    editor.chain()
      .focus()
      .createParagraphNear()
      .insertContent(`
        <div class="my-8 p-6 bg-accent/10 rounded-xl border border-border">
          <h3 class="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
            <Type className="h-5 w-5" />
            AI Analysis Results
          </h3>
          <div class="space-y-4">
      `)
      .run();

    suggestions.forEach(suggestion => {
      const { title, content } = formatSuggestionText(suggestion);
      editor.chain()
        .focus()
        .insertContent(`
          <div class="p-4 bg-background rounded-lg border border-border/50">
            ${title ? `<h4 class="text-lg font-bold mb-2 text-primary">${title}</h4>` : ''}
            <p class="text-base leading-7">${content}</p>
          </div>
        `)
        .run();
    });

    editor.chain()
      .focus()
      .insertContent(`
          </div>
        </div>
        <p class="mb-6"></p>
      `)
      .run();

    toast({
      title: "Suggestions inserted",
      description: "All suggestions have been added to your note.",
    });

    setSuggestions([]);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96">
      <div className="space-y-2 mb-2">
        <Select
          value={promptType}
          onValueChange={(value) => setPromptType(value as keyof typeof DEFAULT_PROMPTS)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select what to do..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="improve">Improve Content</SelectItem>
            <SelectItem value="grammar">Check Grammar</SelectItem>
            <SelectItem value="explain">Explain Concepts</SelectItem>
            <SelectItem value="summarize">Summarize Content</SelectItem>
            <SelectItem value="custom">Custom Prompt</SelectItem>
          </SelectContent>
        </Select>

        {promptType === 'custom' && (
          <Input
            placeholder="Enter your custom prompt..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="mt-2"
          />
        )}

        <Button
          onClick={generateSuggestions}
          disabled={isLoading || (promptType === 'custom' && !customPrompt)}
          className="w-full gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? 'Analyzing...' : 'Analyze Content'}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6 shadow-lg max-h-[60vh] flex flex-col">
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <Type className="h-5 w-5" />
              Analysis Results
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={insertAllSuggestions}
                title="Insert all suggestions"
                className="hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSuggestions([])}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {suggestions.map((suggestion, index) => {
              const { title, content } = formatSuggestionText(suggestion);
              return (
                <div
                  key={index}
                  className="bg-accent/20 hover:bg-accent/30 rounded-lg transition-colors cursor-pointer group"
                  onClick={() => insertSuggestion(suggestion)}
                >
                  <div className="p-4">
                    {title && (
                      <h4 className="text-sm font-bold mb-2 text-primary flex items-center gap-2">
                        <Bold className="h-4 w-4" />
                        {title}
                      </h4>
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm leading-6 text-foreground/90 flex-1">
                        {content}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-primary hover:text-primary-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          insertSuggestion(suggestion);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}