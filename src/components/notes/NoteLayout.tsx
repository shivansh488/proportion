import { NoteSidebar } from "./NoteSidebar";
import { NoteList } from "./NoteList";
import { NoteContent } from "./NoteContent";

export function NoteLayout() {
  return (
    <div className="flex min-h-screen">
      <NoteSidebar />
      <NoteList />
      <NoteContent />
    </div>
  );
}