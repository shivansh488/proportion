
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings, Plus, Home, Search, FolderOpen, FileCode } from "lucide-react";
import { useTheme } from "next-themes";
import { SpotifyPlayer } from "@/components/spotify/SpotifyPlayer";
import { useToast } from "@/components/ui/use-toast";

export function NoteSidebar() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleNewPage = () => {
    // For now, we'll just show a toast since we need to implement the full functionality
    toast({
      title: "New page created",
      description: "A new blank note has been created.",
    });
  };

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold text-lg">Proportion</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Button className="w-full justify-start" variant="secondary" onClick={handleNewPage}>
          <Plus className="mr-2 h-4 w-4" />
          New Page
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FolderOpen className="mr-2 h-4 w-4" />
            All Notes
          </Button>
        </nav>
      </div>

      <SpotifyPlayer />

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
