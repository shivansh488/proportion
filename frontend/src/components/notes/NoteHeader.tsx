
import { Calendar, Folder } from "lucide-react";

interface NoteHeaderProps {
  createdAt?: string;
}

export function NoteHeader({ createdAt }: NoteHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{createdAt ? new Date(createdAt).toLocaleDateString() : 'New Note'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4" />
          <span>Personal</span>
        </div>
      </div>
    </div>
  );
}
