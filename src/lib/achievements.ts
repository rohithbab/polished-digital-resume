export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
  link?: string;
}

// Empty array for initial state
export const achievements: Achievement[] = [];
