import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronUp, ChevronDown } from "lucide-react";
import StatusBadge from './statusBadge';
import TeamMember from './teamMember';
import { formatDistanceToNow, format, isAfter, parse, isValid } from 'date-fns';

interface ProjectDetailProps {
  title: string;
  description: string;
  createdAt: string;
  deadline: string;
  status: string;
  teamMembers: string[];
}

// Improved helper function to parse date strings
const parseDate = (dateString: string): Date | null => {
  try {
    // Try to parse as DD/MM/YYYY format
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    
    // Check if the parsed date is valid
    if (isValid(parsedDate)) {
      return parsedDate;
    }
    
    // If dateString is already an ISO string or another format
    const date = new Date(dateString);
    return isValid(date) ? date : null;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

// Helper function to format date for display
const formatDate = (dateString: string): string => {
  const date = parseDate(dateString);
  if (!date) return 'Invalid date';
  return format(date, 'MMM d, yyyy');
};

// Helper function to calculate time remaining
const getTimeRemaining = (deadline: string): string => {
  const deadlineDate = parseDate(deadline);
  
  // Return early if date is invalid
  if (!deadlineDate) return 'Invalid deadline';
  
  const now = new Date();
  
  if (isAfter(now, deadlineDate)) {
    return 'Overdue';
  }
  
  return formatDistanceToNow(deadlineDate, { addSuffix: true });
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  title,
  description,
  createdAt,
  deadline,
  status,
  teamMembers 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeRemaining = getTimeRemaining(deadline);
  const isOverdue = timeRemaining === 'Overdue';
  
  // For smooth height animation
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const [sidebarHeight, setSidebarHeight] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
    if (sidebarRef.current) {
      setSidebarHeight(sidebarRef.current.scrollHeight);
    }
  }, [description, teamMembers, createdAt, deadline]);

  return (
    <div className="border-b-2 pb-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
        <div className="space-y-4 flex-1">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StatusBadge status={status} />
                <div 
                  className="transition-all duration-300 ease-in-out"
                  style={{
                    transform: isCollapsed ? 'translateX(16px)' : 'translateX(0)',
                    opacity: 1,
                    marginLeft: isCollapsed ? '12px' : '0'
                  }}
                >
                  {isOverdue && (
                    <span className="text-sm font-medium ml-3 flex items-center text-red-500">
                      <Clock className="w-4 h-4 mr-1.5 inline" />
                      {timeRemaining}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {!isOverdue && (
                  <span className="text-sm font-medium flex items-center text-gray-300">
                    <Clock className="w-4 h-4 mr-1.5 inline" />
                    {timeRemaining}
                  </span>
                )}
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)} 
                  className="ml-4 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={isCollapsed ? "Expand project details" : "Collapse project details"}
                >
                  <div className="transition-transform duration-300" style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-3 text-balance">{title}</h1>
          </div>
          
          <div 
            ref={contentRef}
            style={{ 
              maxHeight: isCollapsed ? '0px' : contentHeight ? `${contentHeight}px` : 'none',
              transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease-in-out',
              opacity: isCollapsed ? 0 : 1,
              visibility: isCollapsed ? 'hidden' : 'visible',
              transitionDelay: isCollapsed ? '0s, 0s' : '0s, 0.1s',
              marginBottom: isCollapsed ? '0' : undefined
            }}
            className="overflow-hidden"
          >
            <p className="text-gray-600 leading-relaxed max-w-prose text-balance">
              {description}
            </p>
            
            <div className="pt-4 mt-2">
  <p className="text-sm text-gray-400 mb-2">Team Members</p>
  <div className="flex ml-10">
    {teamMembers.map((member, index) => (
      <TeamMember 
        key={index} 
        name={member} // Pass the entire member object
        index={index} 
      />
    ))}
  </div>
</div>
          </div>
        </div>
        
        <div 
          ref={sidebarRef}
          className="shrink-0 border-l pl-8 py-2 space-y-4"
          style={{ 
            maxHeight: isCollapsed ? '0px' : sidebarHeight ? `${sidebarHeight}px` : 'none',
            width: isCollapsed ? '0px' : 'auto',
            opacity: isCollapsed ? 0 : 1,
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease-in-out, width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            visibility: isCollapsed ? 'hidden' : 'visible',
            borderLeftWidth: isCollapsed ? '0px' : '1px',
            paddingLeft: isCollapsed ? '0px' : '2rem',
            transitionDelay: isCollapsed ? '0s, 0s, 0s' : '0s, 0.1s, 0s'
          }}
        >
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <div>
              <p className="font-medium">Created</p>
              <p>{formatDate(createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <div>
              <p className="font-medium">Deadline</p>
              <p className={isOverdue ? 'text-red-500 font-medium' : ''}>
                {formatDate(deadline)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;