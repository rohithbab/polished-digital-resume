import { useState } from 'react';
import { X } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { debug } from '../../utils/debug';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

// Define allowed credentials
const ALLOWED_CREDENTIALS = [
  { email: 'rohithbabu031@gmail.com', password: '#rohith@2244' },
  { email: 'rohithbabu2244@gmail.com', password: '#rohith@2244' }
];

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Log login attempt
      await debug.info('Login attempt', { email });

      // Check if the credentials are in the allowed list
      const isAllowed = ALLOWED_CREDENTIALS.some(
        cred => cred.email === email && cred.password === password
      );

      if (!isAllowed) {
        const errorMessage = 'Invalid email or password';
        setError(errorMessage);
        await debug.error('Login failed - Invalid credentials', { 
          email,
          isAllowed,
          allowedEmails: ALLOWED_CREDENTIALS.map(c => c.email)
        });
        setIsLoading(false);
        return;
      }

      // If credentials are allowed, proceed with Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await debug.info('Login successful', { 
        email,
        uid: userCredential.user.uid 
      });
      
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      let errorMessage = 'Invalid email or password';
      
      // Handle specific Firebase error codes
      if (err.code) {
        switch (err.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
          default:
            errorMessage = `Authentication error: ${err.message}`;
        }
      }

      setError(errorMessage);
      await debug.error('Login failed - Firebase error', { 
        email,
        errorCode: err.code,
        errorMessage: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent/50"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent/50"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center"
          >
            {isLoading ? (
              <span className="flex items-center">
                Logging in...
                <div className="ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 