import React from 'react';
import CreateProject from './CreateProject';
import ProjectHistory from './ProjectHistory';

const Index = () => {
  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      <main className="pt-24 pb-16 flex flex-col gap-6 overflow-auto h-full">
        <CreateProject />
        <div className="w-full h-px bg-border/50 max-w-5xl mx-auto my-4" />
        <ProjectHistory />
      </main>
    </div>
  );
};

export default Index;
