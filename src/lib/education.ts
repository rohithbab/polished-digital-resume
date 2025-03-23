// Education interface
export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  description?: string;
  gpa?: string;
  achievements?: string[];
  logo?: string;
}

// Empty initial state
export const educationData: Education[] = [];

// Export for compatibility with components
export const education = educationData; 