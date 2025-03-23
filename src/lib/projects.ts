export interface Project {
  id: string;
  title: string;
  description: string;
  summary: string;
  image: string;
  demoUrl?: string;
  codeUrl?: string;
  technologies: string[];
}

// Empty array for initial state
export const projects: Project[] = [];
