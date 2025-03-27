import { useState, useEffect } from 'react';
import { Send, Instagram, Linkedin, MessageSquare, Edit, Save, X, Github } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthGuard } from '../hooks/useAuthGuard';
import LoginModal from './ui/LoginModal';

interface SocialLink {
  platform: string;
  icon: React.ReactNode;
  url: string;
  username: string;
  placeholder: string;
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [editingSocial, setEditingSocial] = useState<string | null>(null);
  const { isAuthenticated, showLoginModal, setShowLoginModal, handleProtectedAction } = useAuthGuard();
  
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      platform: 'LinkedIn',
      icon: <Linkedin className="h-6 w-6 text-primary dark:text-accent" />,
      url: '',
      username: 'linkedin.com/in/username',
      placeholder: 'https://linkedin.com/in/username'
    },
    {
      platform: 'GitHub',
      icon: <Github className="h-6 w-6 text-primary dark:text-accent" />,
      url: '',
      username: 'github.com/username',
      placeholder: 'https://github.com/username'
    },
    {
      platform: 'Instagram',
      icon: <Instagram className="h-6 w-6 text-primary dark:text-accent" />,
      url: '',
      username: '@username',
      placeholder: 'https://instagram.com/username'
    },
    {
      platform: 'WhatsApp',
      icon: <MessageSquare className="h-6 w-6 text-primary dark:text-accent" />,
      url: '',
      username: '+1 (234) 567-890',
      placeholder: 'https://wa.me/1234567890'
    }
  ]);
  
  const [tempUrl, setTempUrl] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  
  // Load social links from Firebase on component mount
  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const socialLinksDoc = await getDoc(doc(db, 'socialLinks', 'links'));
        if (socialLinksDoc.exists()) {
          const data = socialLinksDoc.data();
          setSocialLinks(prevLinks => 
            prevLinks.map(link => ({
              ...link,
              url: data[link.platform]?.url || '',
              username: data[link.platform]?.username || link.username
            }))
          );
        }
      } catch (error) {
        console.error('Error loading social links:', error);
      }
    };
    loadSocialLinks();
  }, []);

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

  const startEditing = (platform: string, url: string, username: string) => {
    handleProtectedAction(() => {
      setEditingSocial(platform);
      setTempUrl(url);
      setTempUsername(username);
    });
  };

  const cancelEditing = () => {
    setEditingSocial(null);
  };

  const saveSocialLink = async (platform: string) => {
    try {
      const socialLinksRef = doc(db, 'socialLinks', 'links');
      const socialLinksDoc = await getDoc(socialLinksRef);
      
      const updatedData = {
        [platform]: {
          url: tempUrl,
          username: tempUsername
        }
      };

      if (socialLinksDoc.exists()) {
        await updateDoc(socialLinksRef, updatedData);
      } else {
        await setDoc(socialLinksRef, updatedData);
      }

      setSocialLinks(prev => prev.map(link => 
        link.platform === platform 
          ? { ...link, url: tempUrl, username: tempUsername } 
          : link
      ));
      setEditingSocial(null);
    } catch (error) {
      console.error('Error saving social link:', error);
    }
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
                {socialLinks.map((social) => (
                  <div key={social.platform} className="relative">
                    {editingSocial === social.platform ? (
                      <div className="p-4 rounded-lg bg-secondary/20 dark:bg-secondary/40">
                        <div className="mb-3">
                          <label className="block text-sm font-medium mb-1">URL</label>
                          <input
                            type="text"
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            placeholder={social.placeholder}
                            className="w-full px-3 py-1.5 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent/50"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium mb-1">Display Text</label>
                          <input
                            type="text"
                            value={tempUsername}
                            onChange={(e) => setTempUsername(e.target.value)}
                            placeholder={social.username}
                            className="w-full px-3 py-1.5 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent/50"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelEditing}
                            className="p-1.5 rounded-md hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => saveSocialLink(social.platform)}
                            className="p-1.5 rounded-md hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {isAuthenticated && (
                          <button
                            onClick={() => startEditing(social.platform, social.url, social.username)}
                            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors z-10"
                            aria-label={`Edit ${social.platform} link`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {social.url ? (
                          <a 
                            href={social.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 rounded-lg hover:bg-secondary/50 dark:hover:bg-secondary/30 transition-colors"
                          >
                            <div className="p-2 bg-primary/10 dark:bg-accent/10 rounded-md mr-4">
                              {social.icon}
                            </div>
                            <div>
                              <h4 className="font-bold">{social.platform}</h4>
                              <p className="text-sm text-muted-foreground">{social.username}</p>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-center p-4 rounded-lg cursor-default">
                            <div className="p-2 bg-primary/10 dark:bg-accent/10 rounded-md mr-4">
                              {social.icon}
                            </div>
                            <div>
                              <h4 className="font-bold">{social.platform}</h4>
                              <p className="text-sm text-muted-foreground">No link added yet</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
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

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => setShowLoginModal(false)}
      />
    </section>
  );
};

export default Contact;
