export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username: string;
  placeholder: string;
}

// Initial placeholder data for social links
export const socialLinks: SocialLink[] = [
  {
    id: '1',
    platform: 'Instagram',
    url: '',
    username: '@username',
    placeholder: 'https://instagram.com/username'
  },
  {
    id: '2',
    platform: 'LinkedIn',
    url: '',
    username: 'linkedin.com/in/username',
    placeholder: 'https://linkedin.com/in/username'
  },
  {
    id: '3',
    platform: 'WhatsApp',
    url: '',
    username: '+1 (234) 567-890',
    placeholder: 'https://wa.me/1234567890'
  }
]; 