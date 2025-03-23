// Hobbies interface
export interface Hobby {
  id?: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
}

// Empty initial state
export const hobbiesData: Hobby[] = [];

// Export for compatibility with components
export const hobbies = hobbiesData; 