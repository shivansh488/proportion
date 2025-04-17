import React from 'react';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { Project } from '@/lib/projectData';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const statusColors = {
    active: 'bg-blue-900/40 text-blue-300 dark:bg-blue-900/40 dark:text-blue-300',
    completed: 'bg-green-900/40 text-green-300 dark:bg-green-900/40 dark:text-green-300',
    archived: 'bg-gray-800/40 text-gray-300 dark:bg-gray-800/40 dark:text-gray-300'
  };
  
  return (
    <div 
      className="group project-card glass-card-dark p-6 relative overflow-hidden animate-fade-up border-gray-800"
      onClick={onClick}
    >
      {/* Status indicator line */}
      <div 
        className={cn(
          "absolute top-0 left-0 w-full h-1",
          project.status === 'active' ? 'bg-blue-600' : 
          project.status === 'completed' ? 'bg-green-600' : 
          'bg-gray-600'
        )}
      />
      
      <div className="space-y-5">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-xl group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", statusColors[project.status])}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {project.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-5 text-xs">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>Created {(project.createdAt)}</span>
          </div>
          
          
          
          
        </div>
        
        <div className="pt-2 mt-auto flex justify-end">
          <button className="text-xs flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="mr-1">View project</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;