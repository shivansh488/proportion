export interface Project {
  _id: string; // MongoDB ID
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' ; // Example status values
  createdAt: string; // ISO date string
  deadline: string; // ISO date string
  owner: string; // Email of the project owner
  teamMembers: TeamMember[]; // Array of team members
  __v?: number; // Optional version key from MongoDB
} 
export interface TeamMember {
  name: string;
  email: string;
}
  
  