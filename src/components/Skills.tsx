
import { Database, Code, LineChart, Server, PieChart, Brain, FileSpreadsheet, Network, GitBranch, Lock } from 'lucide-react';

const skillsData = [
  {
    category: "Data Analysis",
    icon: <LineChart className="h-8 w-8 text-primary dark:text-accent" />,
    skills: ["Statistical Analysis", "Regression Models", "Hypothesis Testing", "Time Series Analysis", "A/B Testing"],
    proficiency: 95,
  },
  {
    category: "Data Visualization",
    icon: <PieChart className="h-8 w-8 text-primary dark:text-accent" />,
    skills: ["Tableau", "Power BI", "D3.js", "Matplotlib", "Seaborn"],
    proficiency: 90,
  },
  {
    category: "Programming",
    icon: <Code className="h-8 w-8 text-primary dark:text-accent" />,
    skills: ["Python", "R", "SQL", "JavaScript", "Shell Scripting"],
    proficiency: 85,
  },
  {
    category: "Machine Learning",
    icon: <Brain className="h-8 w-8 text-primary dark:text-accent" />,
    skills: ["Supervised Learning", "Unsupervised Learning", "Feature Engineering", "Model Validation", "Neural Networks"],
    proficiency: 80,
  },
  {
    category: "Database Management",
    icon: <Database className="h-8 w-8 text-primary dark:text-accent" />,
    skills: ["SQL", "NoSQL", "Data Warehousing", "ETL Processes", "Schema Design"],
    proficiency: 85,
  },
  {
    category: "Big Data Technologies",
    icon: <Server className="h-8 w-8 text-primary dark:text-accent" />,
    skills: ["Hadoop", "Spark", "Kafka", "Hive", "Pig"],
    proficiency: 75,
  },
  {
    category: "Spreadsheet & BI Tools",
    icon: <FileSpreadsheet className="h-8 w-8 text-primary dark:text-accent" />,
    skills: ["Excel Advanced", "Google Sheets", "Power Query", "DAX", "Looker"],
    proficiency: 95,
  },
  {
    category: "Data Engineering",
    icon: <Network className="h-8 w-8 text-primary dark:text-accent" />,
    skills: ["Data Pipelines", "API Integration", "Data Cleaning", "Data Validation", "Workflow Automation"],
    proficiency: 80,
  },
  {
    category: "Version Control",
    icon: <GitBranch className="h-8 w-8 text-primary dark:text-accent" />,
    skills: ["Git", "GitHub", "Bitbucket", "CI/CD Workflows", "Collaborative Development"],
    proficiency: 85,
  },
  {
    category: "Data Security",
    icon: <Lock className="h-8 w-8 text-primary dark:text-accent" />,
    skills: ["Data Privacy", "GDPR Compliance", "Data Encryption", "Access Controls", "Security Auditing"],
    proficiency: 75,
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-secondary/30 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Skills</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technical expertise and competencies that I bring to data analytics projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((skillSet, index) => (
            <div 
              key={skillSet.category}
              className="glass-card p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 dark:bg-accent/10 rounded-md mr-3">
                  {skillSet.icon}
                </div>
                <h3 className="text-xl font-bold">{skillSet.category}</h3>
              </div>
              
              <div className="mb-4">
                <div className="w-full bg-secondary/50 dark:bg-secondary/30 rounded-full h-2.5">
                  <div 
                    className="bg-primary dark:bg-accent h-2.5 rounded-full"
                    style={{ width: `${skillSet.proficiency}%` }}
                  ></div>
                </div>
              </div>
              
              <ul className="space-y-1">
                {skillSet.skills.map((skill) => (
                  <li key={skill} className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary dark:bg-accent rounded-full mr-2"></div>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
