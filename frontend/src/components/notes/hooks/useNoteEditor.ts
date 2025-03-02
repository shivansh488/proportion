
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useNoteEditor(noteId: string | undefined, initialContent: string) {
  const { toast } = useToast();

  return useEditor({
    extensions: [
      StarterKit,
    ],
    content: initialContent || `<h1>New Note</h1><p>Start writing...</p>`,
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
}
