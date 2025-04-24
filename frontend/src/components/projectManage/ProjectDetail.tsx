import React, { useState, useEffect } from 'react';
import ProjectDetail from './projectHeadline/projectDetail';
import { useProject } from '@/contexts/project';


const defaultProjectDetail: ProjectDetailType = {
  _id: "",
  title: "",
  description: "",
  createdAt: "",
  deadline: "",
  status: "",
  teamMembers: []
};

interface ProjectDetailType {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  deadline: string;
  status: string;
  teamMembers: string[];
}




const Index: React.FC = () => {  // Destructure projectDetail from props
  const {project,}=useProject()
  const [projectDetail, setProjectDetail] = useState<ProjectDetailType>(defaultProjectDetail);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  // You can fetch project data or do other logic here if needed
  if(loading){
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#18181B]">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-t-white border-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-300">Loading...</p>
      </div>
    </div>
    );
  }
  return (
    <div>
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectDetail
          title={project.title}
          description={project.description}
          createdAt={project.createdAt}
          deadline={project.deadline}
          status={project.status}
          teamMembers={project.teamMembers}
        />
      </main>
    </div>
  );
};

export default Index;
