export interface Certification {
  id: string;
  name: string;
  description: string;
  link: string;
  date: string;
}

// Empty array for initial state
export const certifications: Certification[] = []; 