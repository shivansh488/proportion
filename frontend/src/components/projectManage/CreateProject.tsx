import React, { useRef, useState, useEffect } from 'react';
import { PlusCircle, ChevronRight } from 'lucide-react';
import CustomButton from '../ui/CustomButton';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, FileText, Clock, Mail, Activity } from 'lucide-react';
import { motion } from "framer-motion";
import { useAuth } from '@/contexts/auth';
import axios from "axios"

interface TeamMember {
  name: string;
  email: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  teamMembers: TeamMember[];
  status: string;
  deadline?: string;
  createdAt: string;
  owner:string;
}

const ProjectTemplate = ({ 
  title, 
  description, 
  onClick 
}: { 
  title: string; 
  description: string; 
  onClick: () => void;
}) => {
  
  return (
    <div 
      className="group relative px-6 py-5 rounded-lg border border-border bg-card hover:border-primary/20 transition-all duration-300 ease-out cursor-pointer animate-fade-in "
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 pointer-events-none"></div>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {description}
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

const CreateProject = () => {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);
  const {user}=useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Format current date as ISO string (YYYY-MM-DDT00:00:00.000Z)
  // This format is compatible with date-fns parseISO function
  const formatDateForStorage = (date: Date): string => {
    return date.toISOString();
  };
  
  // Format date for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    teamMembers: [{ name: '', email: '' }],
    status: "Pending",
    deadline: formatDateForStorage(new Date()),
    createdAt: formatDateForStorage(new Date()),
    owner:user.email

  });
  
  // Properly typed refs
  const addProjectButtonRef = useRef<HTMLButtonElement>(null);
  const projectTitleInputRef = useRef<HTMLInputElement>(null);
  
  // Effect to handle focus when view changes
  useEffect(() => {
    if (showTemplates) {
      // Small delay to ensure the DOM is updated before focusing
      setTimeout(() => {
        if (projectTitleInputRef.current) {
          projectTitleInputRef.current.focus();
        }
      }, 50);
    } else {
      setTimeout(() => {
        if (addProjectButtonRef.current) {
          addProjectButtonRef.current.focus();
        }
      }, 50);
    }
  }, [showTemplates]);
  
 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await axios.post<ProjectFormData>(
      "http://localhost:8000/user/save-project",
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data) {
      console.log(response.data);
      
      window.localStorage.setItem("ProjectDetail", JSON.stringify(response.data));
      navigate('/new-project');
    }
  } catch (error) {
    console.error("Error saving project:", error);
  } finally {
    setIsLoading(false);
  }
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for date inputs
    if (name === 'deadline') {
      // Convert YYYY-MM-DD to ISO string for storage
      const selectedDate = new Date(value);
      setFormData(prev => ({
        ...prev,
        [name]: formatDateForStorage(selectedDate)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleTeamMemberChange = (index: number, field: 'name' | 'email', value: string) => {
    setFormData(prev => {
      const newTeamMembers = [...prev.teamMembers];
      newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
      return { ...prev, teamMembers: newTeamMembers };
    });
  };
  
  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', email: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    if (formData.teamMembers.length > 1) {
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleCreateProject = () => {
    setShowTemplates(true);
  };
  
  // Format date for display
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 animate-blur-in ">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-medium tracking-tight">Create new project</h2>
          <p className="text-muted-foreground">Start with a template or create a custom project.</p>
        </div>
        
        {!showTemplates ? (
          <div className="glass-card p-10 flex flex-col items-center justify-center gap-6 shadow-glass hover:shadow-glass-hover transition-all duration-500">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center animate-float">
              <PlusCircle className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2 max-w-md">
              <h3 className="text-xl font-medium">Create your next project</h3>
              <p className="text-muted-foreground text-sm">
                Choose from our curated templates or start from scratch to bring your vision to life.
              </p>
            </div>
            <CustomButton 
              ref={addProjectButtonRef} 
              onClick={handleCreateProject}
            >
              Get Started
            </CustomButton>
          </div>
        ) : (
          <motion.div layout className="min-h-screen text-gray-100">
            <motion.div layout className="w-full max-w-4xl mx-auto px-4 py-12">
              <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#2A2A2A] p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <label htmlFor="title" className="text-sm font-medium text-gray-200">
                          Project Title
                        </label>
                      </div>
                      <input
                        ref={projectTitleInputRef}
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all duration-200"
                        placeholder="Enter project title"
                        required
                      />
                    </div>
      
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <label htmlFor="description" className="text-sm font-medium text-gray-200">
                          Description
                        </label>
                      </div>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all duration-200"
                        placeholder="Describe your project"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-yellow-400" />
                        <label htmlFor="status" className="text-sm font-medium text-gray-200">
                          Status
                        </label>
                      </div>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-100 transition-all duration-200"
                        required
                      >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
      
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-400" />
                          <label className="text-sm font-medium text-gray-200">
                            Team Members
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={addTeamMember}
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          + Add Member
                        </button>
                      </div>
                      
                      {formData.teamMembers.map((member, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                              placeholder="Member name"
                              className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all duration-200"
                              required
                            />
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="email"
                              value={member.email}
                              onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                              placeholder="Email address"
                              className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all duration-200"
                              required
                            />
                            {formData.teamMembers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTeamMember(index)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 transition-colors"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
      
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-orange-400" />
                        <label htmlFor="deadline" className="text-sm font-medium text-gray-200">
                          Deadline
                        </label>
                      </div>
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formatDateForInput(formData.deadline)}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:ring-2 placeholder-zinc-400 focus:ring-orange-500 focus:border-transparent text-zinc-400 transition-all duration-200"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-teal-400" />
                        <label htmlFor="createdAt" className="text-sm font-medium text-gray-200">
                          Created Date
                        </label>
                      </div>
                      <input
                        type="date"
                        id="createdAt"
                        name="createdAt"
                        value={formatDateForInput(formData.createdAt)}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:ring-2 placeholder-zinc-400 focus:ring-teal-500 focus:border-transparent text-zinc-400 transition-all duration-200"
                        disabled
                      />
                    </div>
                  </div>
      
                  <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                    <div className="text-sm text-gray-400">
                      Created: {formatDateForDisplay(formData.createdAt)}
                    </div>
                    <div className='flex gap-3'>
                      <button
                        type="button"
                        onClick={() => setShowTemplates(false)}
                        className="px-6 py-3 bg-zinc-600 text-white rounded-lg hover:bg-zinc-500 transform hover:scale-105 transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                          type="submit"
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 font-medium"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreateProject;