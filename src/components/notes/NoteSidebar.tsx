import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  FolderClosed,
  Heart,
  Plus,
  Star,
  Trash2,
  Archive
} from "lucide-react";

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
  return (
    <nav className="w-64 h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-sidebar-foreground mb-6">Nowted</h1>
        <Button className="w-full justify-start gap-2 mb-6">
          <Plus size={16} />
          New Note
        </Button>
      </div>

      <div className="px-4 mb-4">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-2">Recents</h2>
        <div className="space-y-1">
          <SidebarItem
            icon={<FileText size={16} />}
            label="Reflection on the Month of June"
            active
          />
          <SidebarItem
            icon={<FileText size={16} />}
            label="Project proposal"
          />
          <SidebarItem
            icon={<FileText size={16} />}
            label="Travel itinerary"
          />
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-sidebar-foreground">Folders</h2>
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
            label="Travel"
          />
          <SidebarItem
            icon={<FolderClosed size={16} />}
            label="Events"
          />
          <SidebarItem
            icon={<FolderClosed size={16} />}
            label="Finances"
          />
        </div>
      </div>

      <div className="px-4 mt-auto mb-4">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-2">More</h2>
        <div className="space-y-1">
          <SidebarItem
            icon={<Star size={16} />}
            label="Favorites"
          />
          <SidebarItem
            icon={<Trash2 size={16} />}
            label="Trash"
          />
          <SidebarItem
            icon={<Archive size={16} />}
            label="Archived Notes"
          />
        </div>
      </div>
    </nav>
  );
}