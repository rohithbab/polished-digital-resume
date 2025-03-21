
export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  link?: string;
}

export const achievements: Achievement[] = [
  {
    id: "data-science-award",
    title: "Excellence in Data Science Award",
    description: "Recognized for outstanding contributions to the field of data science and analytics, demonstrating exceptional skill in deriving insights from complex datasets.",
    date: "November 2022",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Data+Science+Award",
    link: "https://example.com/awards/data-science",
  },
  {
    id: "ai-research",
    title: "AI Research Publication",
    description: "Published innovative research on applying machine learning techniques to optimize business processes, featured in a leading industry journal.",
    date: "June 2021",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=AI+Research",
    link: "https://example.com/journal/ai-research",
  },
  {
    id: "hack-winner",
    title: "Data Hackathon Winner",
    description: "First place in a competitive data science hackathon, developing a solution that accurately predicted customer behavior patterns for a retail client.",
    date: "September 2020",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Hackathon+Winner",
    link: "https://example.com/hackathon/winners",
  },
  {
    id: "certification",
    title: "Advanced Data Analytics Certification",
    description: "Earned prestigious certification in advanced data analytics techniques, demonstrating expertise in statistical analysis and data visualization.",
    date: "March 2020",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Analytics+Certification",
    link: "https://example.com/certification/analytics",
  },
  {
    id: "community-award",
    title: "Community Contribution Award",
    description: "Recognized for significant contributions to the data science community through open-source projects, mentoring, and educational content creation.",
    date: "December 2019",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Community+Award",
    link: "https://example.com/community/recognition",
  }
];
