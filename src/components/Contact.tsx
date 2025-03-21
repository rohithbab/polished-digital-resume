
import { useState } from 'react';
import { Send, Instagram, Linkedin, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thanks for your message! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    }, 1500);
  };
  
  return (
    <section id="contact" className="py-20 bg-secondary/30 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Contact Me</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to discuss a data analytics opportunity? Get in touch with me.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="animate-fade-in-left">
            <form onSubmit={handleSubmit} className="glass-card p-8">
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent/50"
                  placeholder="Your name"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent/50"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent/50 resize-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    Sending...
                    <div className="ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </span>
                ) : (
                  <span className="flex items-center">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
              
              {submitMessage && (
                <div className="mt-4 p-3 bg-primary/10 dark:bg-accent/10 rounded-md text-center text-primary dark:text-accent">
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
          
          <div className="animate-fade-in-right">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
              <p className="mb-8 text-muted-foreground">
                Whether you're looking for a data analyst for your project or just want to say hello, I'd love to hear from you.
              </p>
              
              <div className="space-y-6">
                <a 
                  href="https://instagram.com/username" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-lg hover:bg-secondary/50 dark:hover:bg-secondary/30 transition-colors"
                >
                  <div className="p-2 bg-primary/10 dark:bg-accent/10 rounded-md mr-4">
                    <Instagram className="h-6 w-6 text-primary dark:text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold">Instagram</h4>
                    <p className="text-sm text-muted-foreground">@username</p>
                  </div>
                </a>
                
                <a 
                  href="https://linkedin.com/in/username" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-lg hover:bg-secondary/50 dark:hover:bg-secondary/30 transition-colors"
                >
                  <div className="p-2 bg-primary/10 dark:bg-accent/10 rounded-md mr-4">
                    <Linkedin className="h-6 w-6 text-primary dark:text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold">LinkedIn</h4>
                    <p className="text-sm text-muted-foreground">linkedin.com/in/username</p>
                  </div>
                </a>
                
                <a 
                  href="https://wa.me/1234567890" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-lg hover:bg-secondary/50 dark:hover:bg-secondary/30 transition-colors"
                >
                  <div className="p-2 bg-primary/10 dark:bg-accent/10 rounded-md mr-4">
                    <MessageSquare className="h-6 w-6 text-primary dark:text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold">WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">+1 (234) 567-890</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-20 pt-6 border-t border-border text-center animate-fade-in">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} M E Rohith Babu. All rights reserved.
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
