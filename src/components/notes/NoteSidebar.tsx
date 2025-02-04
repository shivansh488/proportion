import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  FolderClosed,
  Heart,
  Plus,
  Star,
  Trash2,
  Archive,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 w-full px-4 py-2 text-sm rounded-lg transition-colors",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export function NoteSidebar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-64 h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-sidebar-foreground">Proportion</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
        <Button className="w-full justify-start gap-2 mb-6">
          <Plus size={16} />
          New Page
        </Button>
      </div>

      <div className="px-4 mb-4">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-2">Quick Access</h2>
        <div className="space-y-1">
          <SidebarItem
            icon={<FileText size={16} />}
            label="Getting Started"
            active
          />
          <SidebarItem
            icon={<FileText size={16} />}
            label="Tasks"
          />
          <SidebarItem
            icon={<FileText size={16} />}
            label="Projects"
          />
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-sidebar-foreground">Workspaces</h2>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus size={16} />
          </Button>
        </div>
        <div className="space-y-1">
          <SidebarItem
            icon={<FolderClosed size={16} />}
            label="Personal"
          />
          <SidebarItem
            icon={<FolderClosed size={16} />}
            label="Work"
          />
          <SidebarItem
            icon={<FolderClosed size={16} />}
            label="Projects"
          />
        </div>
      </div>

      <div className="px-4 mt-auto mb-4">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-2">Tools</h2>
        <div className="space-y-1">
          <SidebarItem
            icon={<Star size={16} />}
            label="Favorites"
          />
          <SidebarItem
            icon={<Archive size={16} />}
            label="Archive"
          />
          <SidebarItem
            icon={<Trash2 size={16} />}
            label="Trash"
          />
        </div>
      </div>
    </nav>
  );
}