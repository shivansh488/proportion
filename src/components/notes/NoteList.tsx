import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface NoteItemProps {
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
      <span>{date}</span>
    </div>
    <p className="text-sm text-muted-foreground truncate">{excerpt}</p>
  </button>
);

export function NoteList() {
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
        <NoteItem
          title="Getting Started with Proportion"
          date="21/06/2022"
          excerpt="Welcome to Proportion! This is your first note..."
          active
        />
        <NoteItem
          title="Project Ideas"
          date="20/06/2022"
          excerpt="Here are some project ideas for the upcoming..."
        />
        <NoteItem
          title="Meeting Notes"
          date="19/06/2022"
          excerpt="Team sync discussion about the new features..."
        />
        <NoteItem
          title="Reading List"
          date="18/06/2022"
          excerpt="Books and articles I want to read this month..."
        />
      </div>
    </div>
  );
}