
import { NoteSidebar } from "./NoteSidebar";
import { NoteList } from "./NoteList";
import { NoteContent } from "./NoteContent";
import { useLocation } from "react-router-dom";
import ProjectPage from "../projectManage/ProjectPage";
import NewProjectPage from "../projectManage/NewProject"

export function NoteLayout() {
  const location = useLocation();
  const showNoteList = location.pathname === "/notes";
  const showLocalProject = location.pathname === "/local-project";
  const showNewProjectPage = location.pathname === "/new-project";

  return (
    <div className="flex min-h-screen">
      <NoteSidebar />
      {showNoteList && <NoteList />}
      {showLocalProject && <ProjectPage />}
      {showNewProjectPage && <NewProjectPage />}

      {/* Ensure NoteContent is shown only when no other condition is met */}
      {!showNoteList && !showLocalProject && !showNewProjectPage && <NoteContent />}
    </div>
  );
}

