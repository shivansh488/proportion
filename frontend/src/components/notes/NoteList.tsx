
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "@/utils/notes";
import { useNavigate, useParams } from "react-router-dom";

interface NoteItemProps {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  active?: boolean;
  onClick?: () => void;
}

const NoteItem = ({ title, date, excerpt, active, onClick }: NoteItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left p-4 transition-colors",
      active ? "bg-accent" : "hover:bg-accent/50"
    )}
  >
    <h3 className="font-medium mb-1">{title}</h3>
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
      <span>{new Date(date).toLocaleDateString()}</span>
    </div>
    <p className="text-sm text-muted-foreground truncate">{excerpt}</p>
  </button>
);

export function NoteList() {
  const navigate = useNavigate();
  const { id: currentNoteId } = useParams();

  const { data: notes } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  });

  // Function to extract text content from HTML string
  const extractTextFromHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="w-80 h-screen border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-accent/50 rounded-lg border-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto divide-y divide-border">
        {notes?.map((note) => (
          <NoteItem
            key={note.id}
            id={note.id}
            title={note.title}
            date={note.created_at}
            excerpt={extractTextFromHtml(note.content)}
            active={currentNoteId === note.id}
            onClick={() => navigate(`/notes/${note.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
