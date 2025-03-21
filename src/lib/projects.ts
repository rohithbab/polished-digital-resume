
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

export const projects: Project[] = [
  {
    id: "financial-dashboard",
    title: "Financial Data Dashboard",
    description: "Interactive dashboard for financial data analysis with real-time updates and customizable visualizations.",
    summary: "Developed a comprehensive financial dashboard using React, D3.js, and Python for data processing. The dashboard provides real-time market data, portfolio analysis, and customizable visualization options for financial analysts and individual investors.",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Financial+Dashboard",
    demoUrl: "https://example.com/demo/finance",
    codeUrl: "https://github.com/username/financial-dashboard",
    technologies: ["React", "D3.js", "Python", "Flask", "SQL"],
  },
  {
    id: "predictive-analytics",
    title: "Predictive Sales Analytics",
    description: "Machine learning model to predict sales trends and provide actionable insights for retail businesses.",
    summary: "Built a predictive analytics system that uses historical sales data to forecast future trends with 92% accuracy. Implemented various ML algorithms and developed an intuitive front-end for business users to interact with the predictions and generate custom reports.",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Predictive+Analytics",
    demoUrl: "https://example.com/demo/sales",
    codeUrl: "https://github.com/username/predictive-sales",
    technologies: ["Python", "Scikit-Learn", "TensorFlow", "JavaScript", "MongoDB"],
  },
  {
    id: "data-visualization",
    title: "Data Visualization Tool",
    description: "Customizable data visualization platform for creating interactive charts and reports from multiple data sources.",
    summary: "Created a versatile data visualization tool that connects to multiple data sources and allows users to create interactive charts, reports, and dashboards without coding. Features include drag-and-drop interface, template library, and export options for various formats.",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Data+Visualization",
    demoUrl: "https://example.com/demo/dataviz",
    codeUrl: "https://github.com/username/data-viz-tool",
    technologies: ["React", "Node.js", "Chart.js", "GraphQL", "PostgreSQL"],
  },
  {
    id: "customer-segmentation",
    title: "Customer Segmentation Engine",
    description: "AI-powered tool that segments customers based on behavior patterns and preferences.",
    summary: "Designed and implemented a customer segmentation engine that analyzes customer data to identify distinct segments and personas. The tool helps marketing teams target their campaigns more effectively and provides insights into customer behavior patterns.",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Customer+Segmentation",
    demoUrl: "https://example.com/demo/segments",
    codeUrl: "https://github.com/username/customer-segments",
    technologies: ["Python", "R", "K-means Clustering", "Tableau", "AWS"],
  },
  {
    id: "anomaly-detection",
    title: "Anomaly Detection System",
    description: "Real-time system for detecting anomalies in operational data and triggering appropriate alerts.",
    summary: "Developed an anomaly detection system that monitors real-time data streams and identifies unusual patterns that may indicate issues or opportunities. The system uses a combination of statistical methods and machine learning to adapt to changing data patterns over time.",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Anomaly+Detection",
    demoUrl: "https://example.com/demo/anomaly",
    codeUrl: "https://github.com/username/anomaly-detection",
    technologies: ["Python", "Spark", "Kafka", "ElasticSearch", "Kibana"],
  },
  {
    id: "sentiment-analysis",
    title: "Social Media Sentiment Analyzer",
    description: "Tool that analyzes social media data to gauge public sentiment about brands and products.",
    summary: "Built a sentiment analysis platform that processes social media posts to determine public opinion about brands, products, or topics. The system provides sentiment scores, trend analysis, and competitive benchmarking to help companies understand their market perception.",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Sentiment+Analysis",
    demoUrl: "https://example.com/demo/sentiment",
    codeUrl: "https://github.com/username/sentiment-analyzer",
    technologies: ["NLTK", "BERT", "Python", "React", "Redis"],
  },
];
