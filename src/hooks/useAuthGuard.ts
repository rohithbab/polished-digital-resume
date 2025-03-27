import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const useAuthGuard = () => {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleProtectedAction = (action: () => void) => {
    if (user) {
      action();
    } else {
      setShowLoginModal(true);
    }
  };

  return {
    isAuthenticated: !!user,
    showLoginModal,
    setShowLoginModal,
    handleProtectedAction
  };
}; 