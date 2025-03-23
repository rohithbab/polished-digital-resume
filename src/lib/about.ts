// About section interface
export interface About {
  id?: string;
  title?: string;
  headline: string;
  bio: string;
  photo?: string;
  email: string;
  location: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
    other?: string;
  };
}

// Empty initial state
export const aboutData: About[] = [];

// Export for compatibility with components
export const about = aboutData; 