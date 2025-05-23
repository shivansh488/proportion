
import { NoteSidebar } from "./NoteSidebar";
import { NoteList } from "./NoteList";
import { NoteContent } from "./NoteContent";
import { useLocation } from "react-router-dom";
import ProjectPage from "../projectManage/ProjectPage";
import NewProjectPage from "../projectManage/NewProject"
import { Project } from "../projectManage/Project";

export function NoteLayout() {
  const location = useLocation();
  const showNoteList = location.pathname === "/notes";
  const showLocalProject = location.pathname === "/local-project";
  const showNewProjectPage = location.pathname === "/new-project";
  const showProjectPage = location.pathname.startsWith("/project/")

  return (
    <div className="flex min-h-screen">
      <NoteSidebar />
      {showNoteList && <NoteList />}
      {showLocalProject && <ProjectPage />}
      {showNewProjectPage && <NewProjectPage />}
     
      {showProjectPage && <Project/>}
      {/* Add other components or routes as needed */}

      {/* NoteContent is shown only when no other condition is met */}
      {/* You can also add a condition to show NoteContent only when a specific note is selected */}
      {/* NoteContent is shown only when no other condition is met */}
      {/* You can also add a condition to show NoteContent only when a specific note is selected */}



      {/* Ensure NoteContent is shown only when no other condition is met */}
      {!showNoteList && !showLocalProject && !showNewProjectPage && <NoteContent />}
    </div>
  );
}

