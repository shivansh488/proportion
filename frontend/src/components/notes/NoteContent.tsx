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

  // Fetch the note data using useQuery
  const { data: note, isLoading: isNoteLoading } = useQuery<Note>({
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
    enabled: !!noteId, // Only fetch if noteId is present
  });

  // Initialize the editor with the note content
  const editor = useNoteEditor(noteId, note?.content);

  const handleInsertAtCursor = (suggestion: string) => {
    if (editor) {
      editor.chain()
        .focus()
        .insertContent(suggestion)
        .run();
    }
  };

  const { 
    codeBlocks, 
    supportedLanguages,
    isLoadingLanguages,
    insertCodeBlock, 
    handleDeleteCodeBlock, 
    handleCodeChange,
    runCode 
  } = useCodeBlocks();

  // Show loading state while fetching the note
  if (isNoteLoading) {
    return <div>Loading note...</div>;
  }

  // Show error state if editor is not initialized
  if (!editor) {
    return <div>Failed to initialize editor.</div>;
  }

  return (
    <article className="flex-1 h-screen overflow-auto bg-background relative">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Pass the note's creation date to NoteHeader */}
          <NoteHeader createdAt={note?.created_at} />

          {/* Pass the editor and callback to NoteToolbar */}
          <NoteToolbar 
            editor={editor}
            onShowLanguageSelector={() => setShowLanguageSelector(true)}
          />

          {/* Render the editor content */}
          <EditorContent editor={editor} />

          {/* Render code blocks */}
          {codeBlocks.map(block => (
            <CodeBlock
              key={block.id}
              id={block.id}
              code={block.code}
              language={block.language}
              isRunning={block.isRunning}
              output={block.output}
              error={block.error}
              onChange={(newCode) => handleCodeChange(block.id, newCode)}
              onDelete={() => handleDeleteCodeBlock(block.id)}
              onRun={runCode}
            />
          ))}

          {/* Render demo content if no noteId is present */}
          {!noteId && (
            <>
              <CodeBlock
                id="demo"
                language="python"
                code={`print("Hello, World!")
# Try running this code!
for i in range(5):
    print(f"Count: {i}")`}
                onDelete={() => {}}
                onRun={runCode}
              />

              {/* Render AISuggestions component */}
              <AISuggestions 
                editorContent={editor?.getHTML()} 
                editor={editor}
                onInsertAtCursor={handleInsertAtCursor} // Pass the callback
              />
            </>
          )}
        </div>
      </div>

      {/* Render LanguageSelector component */}
      <LanguageSelector
        open={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onSelect={insertCodeBlock}
        languages={supportedLanguages}
        isLoading={isLoadingLanguages}
      />
    </article>
  );
}