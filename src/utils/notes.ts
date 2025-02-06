
import { supabase } from "@/integrations/supabase/client";

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export async function createNote() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be logged in to create notes");
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({
      title: 'Untitled',
      content: `<h1>Untitled</h1><p>Start writing your note here...</p>`,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
