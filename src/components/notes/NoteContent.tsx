
import { EditorContent } from '@tiptap/react';
import { CodeBlock } from "./CodeBlock";
import { AISuggestions } from "./AISuggestions";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Note } from "@/utils/notes";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { useNoteEditor } from './hooks/useNoteEditor';
import { useCodeBlocks } from './hooks/useCodeBlocks';
import { NoteToolbar } from './NoteToolbar';
import { NoteHeader } from './NoteHeader';

export function NoteContent() {
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
  
  const editor = useNoteEditor(noteId, note?.content);
  const { codeBlocks, insertCodeBlock, handleDeleteCodeBlock, handleCodeChange } = useCodeBlocks();

  if (!editor) {
    return null;
  }

  return (
    <article className="flex-1 h-screen overflow-auto bg-background relative">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <NoteHeader createdAt={note?.created_at} />
          <NoteToolbar 
            editor={editor}
            onShowLanguageSelector={() => setShowLanguageSelector(true)}
          />
          <EditorContent editor={editor} />

          {codeBlocks.map(block => (
            <CodeBlock
              key={block.id}
              code={block.code}
              language={block.language}
              onChange={(newCode) => handleCodeChange(block.id, newCode)}
              onDelete={() => handleDeleteCodeBlock(block.id)}
            />
          ))}

          {!noteId && (
            <>
              <CodeBlock
                language="python"
                code={`print("Hello, World!")
# Try running this code!
for i in range(5):
    print(f"Count: {i}")`}
                onDelete={() => {}}
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
