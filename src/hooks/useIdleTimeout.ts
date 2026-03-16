import { useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../services/authService';

const IDLE_TIMEOUT = Number(import.meta.env.VITE_IDLE_TIMEOUT) || 15 * 60 * 1000;
const WARNING_TIMEOUT = Number(import.meta.env.VITE_WARNING_TIMEOUT) || 1 * 60 * 1000;

export const useIdleTimeout = () => {
  const [showWarning, setShowWarning] = useState(false);
  const idleTimerRef = useRef<any>(null);
  const warningTimerRef = useRef<any>(null);
  const isWarningShowingRef = useRef(false);

  const logout = useCallback(() => {
    authService.logout();
    window.location.href = '/login'; // Force redirect on logout
  }, []);

  const resetTimer = useCallback(() => {
    // If warning is showing, don't reset the idle timer
    if (isWarningShowingRef.current) return;

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    // Don't clear warningTimer here; it should only be cleared when handleStayLoggedIn is called

    if (authService.isAuthenticated()) {
      idleTimerRef.current = setTimeout(() => {
        setShowWarning(true);
        isWarningShowingRef.current = true;
        
        // Start warning timer for automatic logout
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        warningTimerRef.current = setTimeout(() => {
          logout();
        }, WARNING_TIMEOUT);
      }, IDLE_TIMEOUT);
    }
  }, [logout]); // Removed showWarning from dependencies

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      // We only clear timers on unmount, not on every re-render of resetTimer
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [resetTimer]);

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    isWarningShowingRef.current = false;
    
    // Clear the logout timer since user confirmed they are still here
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    
    resetTimer();
  };

  return {
    showWarning,
    handleStayLoggedIn,
    logout
  };
};
