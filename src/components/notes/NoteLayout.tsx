
import { NoteSidebar } from "./NoteSidebar";
import { NoteList } from "./NoteList";
import { NoteContent } from "./NoteContent";
import { useLocation } from "react-router-dom";

export function NoteLayout() {
  const location = useLocation();
  const showNoteList = location.pathname === '/notes';

  return (
    <div className="flex min-h-screen">
      <NoteSidebar />
      {showNoteList && <NoteList />}
      <NoteContent />
    </div>
  );
}
