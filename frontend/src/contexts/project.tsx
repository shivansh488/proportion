import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the project type
interface Project {
  id: string | null;
  title: string | null;
  description: string | null;
  createdAt: string | null;
  deadline: string | null;
  teamMembers: string[];
  columns: { title: string; order: number }[]; // Adjust column type as per your structure
  status: string | null;
}

// Initial state for the project
const initialState: Project = {
  id: null,
  title: null,
  description: null,
  createdAt: null,
  deadline: null,
  teamMembers: [],
  columns: [],
  status: null,
};

// Define the context value type
interface ProjectContextType {
  project: Project;
  fetchProject: (projectId: string) => Promise<void>;
}

// Creating context for the project data
const ProjectContext = createContext<ProjectContextType>({
  project: initialState,
  fetchProject: async () => {}, // A no-op function, will be replaced by actual function
});

// Custom hook to use project context
export const useProject = (): ProjectContextType => useContext(ProjectContext);

// Provider component to wrap your application or parts of it
interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [project, setProject] = useState<Project>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data (you can replace this with an actual API call)
  const fetchProject = async (projectId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:8000/user/get-project", {
        method: "POST",
        body: JSON.stringify({ projectId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project data.");
      }

      const data = await response.json();
      const projectData: Project = data.data; // Assuming the API returns the project data in a field called 'data'
      setProject(projectData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider value={{ project, fetchProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
