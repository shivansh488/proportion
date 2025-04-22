import React, { useState, useEffect } from 'react';
import ProjectDetail from './projectHeadline/projectDetail';

interface ProjectDetailType {
  title: string;
  description: string;
  createdAt: string;
  deadline: string;
  status: string;
  teamMembers: string[];
}

const defaultProjectDetail: ProjectDetailType = {
  title: "",
  description: "",
  createdAt: "",
  deadline: "",
  status: "",
  teamMembers: [],
};

const Index: React.FC = () => {
  const [projectDetail, setProjectDetail] = useState<ProjectDetailType>(defaultProjectDetail);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProjectData = () => {
      try {
        const projectDataString = localStorage.getItem("ProjectDetail");
        
        if (!projectDataString) {
          throw new Error("No project data found in localStorage");
        }
        
        const parsedData = JSON.parse(projectDataString);
        console.log("hey",parsedData.data.title)
        setProjectDetail(parsedData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);
  
  return (
    <div>
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectDetail
          title={projectDetail.title}
          description={projectDetail.description}
          createdAt={projectDetail.createdAt}
          deadline={projectDetail.deadline}
          status={projectDetail.status}
          teamMembers={projectDetail.teamMembers}
        />
      </main>
    </div>
  );
};

export default Index;