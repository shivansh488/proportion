import { Button } from "@/components/ui/button";
import { Calendar, Folder, MoreVertical, Plus } from "lucide-react";

export function NoteContent() {
  return (
    <article className="flex-1 h-screen overflow-auto bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>21/06/2022</span>
            </div>
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span>Personal</span>
            </div>
          </div>

          <div contentEditable="true" className="outline-none">
            <h1 className="text-4xl font-bold mb-4 outline-none empty:before:content-[attr(data-placeholder)] empty:text-muted-foreground" data-placeholder="Untitled">Getting Started with Proportion</h1>
            
            <div className="prose prose-sm max-w-none">
              <p className="text-lg text-muted-foreground mb-8">Welcome to Proportion! This is your first note. Click anywhere and start typing...</p>
              
              <h2>🚀 Quick Features</h2>
              <ul>
                <li>Rich text editing with markdown support</li>
                <li>Code execution for multiple languages</li>
                <li>Spotify integration while you work</li>
                <li>AI-powered note suggestions</li>
                <li>Real-time collaboration</li>
              </ul>

              <h2>💡 Pro Tips</h2>
              <ul>
                <li>Use "/" to access the command menu</li>
                <li>Press Ctrl/Cmd + / for keyboard shortcuts</li>
                <li>Drag and drop to organize your notes</li>
              </ul>
            </div>
          </div>

          <Button variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add a block
          </Button>
        </div>
      </div>
    </article>
  );
}