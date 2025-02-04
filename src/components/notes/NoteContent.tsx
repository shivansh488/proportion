import { Button } from "@/components/ui/button";
import { Calendar, Folder, Bold, Italic, List, ListOrdered, Code } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function NoteContent() {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: `
      <h1>Getting Started with Proportion</h1>
      <p>Welcome to Proportion! This is your first note. Click anywhere and start typing...</p>
      
      <h2>🚀 Quick Features</h2>
      <ul>
        <li>Rich text editing with markdown support</li>
        <li>Code execution for multiple languages</li>
        <li>Spotify integration while you work</li>
        <li>AI-powered note suggestions</li>
        <li>Real-time collaboration</li>
      </ul>

      <h2>💡 Pro Tips</h2>
      <ul>
        <li>Use "/" to access the command menu</li>
        <li>Press Ctrl/Cmd + / for keyboard shortcuts</li>
        <li>Drag and drop to organize your notes</li>
      </ul>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <article className="flex-1 h-screen overflow-auto bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>21/06/2022</span>
              </div>
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span>Personal</span>
              </div>
            </div>
          </div>

          <div className="border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-2">
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
            </div>
          </div>

          <EditorContent editor={editor} />
        </div>
      </div>
    </article>
  );
}