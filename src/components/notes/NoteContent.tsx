
import { Button } from "@/components/ui/button";
import { Calendar, Folder, Bold, Italic, List, ListOrdered, Code, FileCode, Plus } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CodeBlock } from "./CodeBlock";
import { AISuggestions } from "./AISuggestions";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Note } from "@/utils/notes";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NoteContent() {
  const { toast } = useToast();
  const { id: noteId } = useParams();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  const { data: note } = useQuery<Note>({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!noteId
  });
  
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: note?.content || `<h1>New Note</h1><p>Start writing...</p>`,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
    onUpdate: async ({ editor }) => {
      if (!noteId) return;
      
      const content = editor.getHTML();
      const { error } = await supabase
        .from('notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', noteId);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to save note.",
          variant: "destructive",
        });
      }
    },
  });

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
    
    editor?.chain().focus().setContent({
      type: 'doc',
      content: [{
        type: 'codeBlock',
        attrs: { language },
        content: [{
          type: 'text',
          text: defaultCode
        }]
      }]
    }).run();

    toast({
      title: "Block inserted",
      description: `A new ${language} code block has been added.`,
    });
  };

  const insertBlock = (type: string) => {
    if (!editor) return;

    switch (type) {
      case 'text':
        editor.chain().focus().setParagraph().run();
        break;
      case 'heading1':
        editor.chain().focus().setHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().setHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().setHeading({ level: 3 }).run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'code':
        setShowLanguageSelector(true);
        break;
      default:
        break;
    }

    toast({
      title: "Block inserted",
      description: `A new ${type} block has been added.`,
    });
  };

  if (!editor) {
    return null;
  }

  return (
    <article className="flex-1 h-screen overflow-auto bg-background relative">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{note ? new Date(note.created_at).toLocaleDateString() : 'New Note'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span>Personal</span>
              </div>
            </div>
          </div>

          <div className="border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add block
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => insertBlock('text')}>
                    Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertBlock('heading1')}>
                    Heading 1
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertBlock('heading2')}>
                    Heading 2
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertBlock('heading3')}>
                    Heading 3
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertBlock('bulletList')}>
                    Bullet List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertBlock('orderedList')}>
                    Numbered List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertBlock('code')}>
                    Code Block
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-accent' : ''}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-accent' : ''}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-accent' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-accent' : ''}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'bg-accent' : ''}
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLanguageSelector(true)}
              >
                <FileCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <EditorContent editor={editor} />

          {!noteId && (
            <>
              <CodeBlock
                language="python"
                code={`print("Hello, World!")
# Try running this code!
for i in range(5):
    print(f"Count: {i}")`}
              />

              <AISuggestions editorContent={editor.getHTML()} />
            </>
          )}
        </div>
      </div>

      <LanguageSelector
        open={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onSelect={insertCodeBlock}
      />
    </article>
  );
}
