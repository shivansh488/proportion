
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings, Plus, Home, Search, FolderOpen, ChevronDown, ChevronRight, Briefcase, User  } from "lucide-react";
import { useTheme } from "next-themes";
import SpotifyPlayer from "../spotify/SpotifyPlayer";
import { useToast } from "@/components/ui/use-toast";
import { createNote, getNotes } from "@/utils/notes";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function NoteSidebar() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: notes } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  });
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(false);

  const handleNewPage = async () => {
    try {
      const note = await createNote();
      toast({
        title: "Success",
        description: "A new note has been created.",
      });
      navigate(`/notes/${note.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    navigate('/search');
    toast({
      title: "Search",
      description: "Search functionality will be implemented soon.",
    });
  };

  const handleAllNotes = () => {
    navigate('/notes');
    toast({
      description: `You have ${notes?.length || 0} notes in total.`,
    });
  };

  const handleHome = () => {
    navigate('/');
  };
  const handleProjectManage = () => {
    navigate('/projectManage');};
  

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
          <Button variant="ghost" className="w-full justify-start" onClick={handleHome}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={handleAllNotes}>
            <FolderOpen className="mr-2 h-4 w-4" />
            All Notes
          </Button>
          <Button variant="ghost" 
        className="w-full justify-start"
        onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
      >
        
        <FolderOpen className="mr-2 h-4 w-4" />
        <span>Workspace</span>
      </Button>
      {isWorkspaceOpen && (
        <div className="ml-6 mt-1 space-y-1">
          <Button className="w-full justify-start" variant="ghost">
            <User className="mr-2 h-4 w-4" />
            <span>Personal</span>
          </Button>
          <Button className="w-full justify-start" variant="ghost">
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Work</span>
          </Button>
        </div>
      )}
        </nav>
      </div>
      <div className="h-[38%] w-full  px-2 flex flex-col justify-center">
      <SpotifyPlayer />
      </div>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
