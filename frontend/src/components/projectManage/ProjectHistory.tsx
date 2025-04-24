import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import ProjectCard from './ProjectCard';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Project } from '@/lib/projectData';
import { useNavigate } from 'react-router-dom';

import { useProject } from '@/contexts/project';

// src/types/project.ts


const ProjectHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const { user } = useAuth();
  const [projectData, setProjectData] = useState<Project[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {fetchProject} = useProject(); // Fetch project function from context
  const navigate = useNavigate(); // Use navigate from react-router-dom
  // Fetch project history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8000/user/get-user-project', {
          method: 'POST',
          body: JSON.stringify({ email: user.email }),
          headers: { 'Content-Type': 'application/json' },
        });
        
        const data = await response.json(); // Parse the JSON response
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch projects');
        }
        
        if (data.success && Array.isArray(data.data)) {
          setProjectData(data.data); // Set the projects array from the `data` field
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch project history. Please try again later.');
        console.error('Error fetching project history:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false in both success and error cases
      }
    };

    setLoading(true);
    setError(null); 
    fetchHistory(); 
  }, [user.email, setProjectData, setLoading, setError]); 

  // Handle project click
  const handleProjectClick = (project: Project) => {
    const projectId=project._id;
    try {
      navigate(`/project/${projectId}`); // Navigate to the project details page
    } catch (error) {
      console.error('Error fetching project details:', error);
    } // Use project._id as the unique identifier
    // Fetch project details using the context function
    // In a real app, this would navigate to the project details page
    // Example: navigate(`/projects/${project._id}`);
  };

  // Filter and sort projects
  const filteredProjects = projectData
    .filter((project) => {
      const projectTitle = project.title?.toLowerCase() || ''; // Use optional chaining and default value
      const projectDescription = project.description?.toLowerCase() || ''; // Use optional chaining and default value

      const matchesSearch =
        projectTitle.includes(searchTerm.toLowerCase()) ||
        projectDescription.includes(searchTerm.toLowerCase());

      const matchesFilter = filter === 'all' || project.status === filter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 animate-blur-in-slow">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Project History</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-9 pr-4 py-2 h-10 w-full sm:w-64 bg-secondary/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative flex items-center">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                className="pl-9 pr-4 py-2 h-10 appearance-none bg-secondary/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <option value="all">All Projects</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <button
              className="flex items-center gap-2 px-4 py-2 h-10 bg-secondary/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>{sortBy === 'newest' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id} // Use project._id as the key
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center animate-fade-in">
            <h3 className="text-xl font-medium mb-3">No projects found</h3>
            <p className="text-muted-foreground mb-0">
              Try adjusting your search or filter to find your projects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHistory;