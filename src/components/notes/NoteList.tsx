import { cn } from "@/lib/utils";

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
      "w-full text-left p-4 border-b border-border transition-colors",
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
    <div className="w-80 h-screen border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold">Personal</h2>
      </div>
      <div className="divide-y divide-border">
        <NoteItem
          title="My Goals for the Next Year"
          date="31/12/2022"
          excerpt="As the year comes to a ..."
        />
        <NoteItem
          title="Reflection on the Month of June"
          date="21/06/2022"
          excerpt="It's hard to believe that ..."
          active
        />
        <NoteItem
          title="My Favorite Memories from Childhood"
          date="11/04/2022"
          excerpt="I was reminiscing about ..."
        />
        <NoteItem
          title="Reflections on My First Year of College"
          date="08/04/2022"
          excerpt="It's hard to believe that ..."
        />
        <NoteItem
          title="My Experience with Meditation"
          date="24/03/2022"
          excerpt="I've been trying to ..."
        />
        <NoteItem
          title="Thoughts on the Pandemic"
          date="01/02/2021"
          excerpt="It's hard to believe that ..."
        />
        <NoteItem
          title="My Favorite Recipes"
          date="08/01/2021"
          excerpt="I love cooking and trying ..."
        />
      </div>
    </div>
  );
}