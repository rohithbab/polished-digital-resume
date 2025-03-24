// Education interface
export interface Education {
  id?: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  additionalInfo?: {
    college?: string;
    department?: string;
    cgpa?: string;
  };
}

// Sample education data
export const educationData: Education[] = [
  {
    id: '1',
    degree: 'High School',
    field: 'General',
    institution: 'Angels Babyland Matric Higher Secondary School',
    location: 'India',
    startDate: '2019',
    endDate: '2021',
    description: 'Percentage: 91.4%',
    additionalInfo: {
      college: 'SIMATS Engineering',
      department: 'Computer Science & Engineering (CSE) - 3rd Year',
      cgpa: '9.0'
    }
  }
];

// Export for compatibility with components
export const education = educationData; 