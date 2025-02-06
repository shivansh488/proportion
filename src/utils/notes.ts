
import { supabase } from "@/integrations/supabase/client";

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function createNote() {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      title: 'Untitled',
      content: `<h1>Untitled</h1><p>Start writing your note here...</p>`
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
