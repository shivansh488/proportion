import React from 'react';
import { cn } from "@/lib/utils";

// Update the interface to handle both string and object formats
interface TeamMemberProps {
  name: string | { name: string; email: string } | undefined;
  index: number;
}

const getInitials = (nameInput: string | { name: string; email: string } | undefined): string => {
  // Handle undefined case
  if (!nameInput) {
    return '??';
  }
  
  // Extract the name string regardless of input format
  const nameString = typeof nameInput === 'string' ? nameInput : nameInput.name;
  
  // Handle empty string case
  if (!nameString || typeof nameString !== 'string') {
    return '??';
  }
  
  return nameString
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
};

const getRandomColor = (nameInput: string | { name: string; email: string } | undefined): string => {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-amber-100 text-amber-800',
    'bg-purple-100 text-purple-800',
    'bg-red-100 text-red-800',
    'bg-cyan-100 text-cyan-800',
  ];
  
  // Handle undefined case
  if (!nameInput) {
    return colors[0];
  }
  
  // Extract the name string regardless of input format
  const nameString = typeof nameInput === 'string' ? nameInput : nameInput.name;
  
  // Handle empty string case
  if (!nameString || typeof nameString !== 'string') {
    return colors[0];
  }
  
  // Use the name to deterministically select a color
  const index = nameString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const TeamMember: React.FC<TeamMemberProps> = ({ name, index }) => {
  const initials = getInitials(name);
  const colorClass = getRandomColor(name);
  
  // Get name and email for title attribute
  const nameString = typeof name === 'string' ? name : name?.name || 'Unknown';
  const emailString = typeof name === 'object' && name?.email ? name.email : '';
  const title = emailString ? `${nameString} (${emailString})` : nameString;
  
  return (
    <div 
      className={cn(
        "relative inline-flex items-center justify-center",
        "w-8 h-8 rounded-full text-xs font-medium",
        "shadow-sm transition-all duration-300",
        "hover:scale-110 hover:z-10",
        colorClass
      )}
      style={{ 
        animationDelay: `${index * 75}ms`,
        transform: `translateX(${index * -10}px)`,
        zIndex: 10 - index
      }}
      title={title}
    >
      {initials}
    </div>
  );
};

export default TeamMember;