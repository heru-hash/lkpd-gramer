import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';

interface IFPContextType {
  isFullscreen: boolean;
  highContrast: boolean;
  soundEnabled: boolean;
  presentationMode: boolean;
  toggleFullscreen: () => void;
  toggleHighContrast: () => void;
  toggleSound: () => void;
  togglePresentationMode: () => void;
  triggerHaptic: () => void;
}

const IFPContext = createContext<IFPContextType | undefined>(undefined);

export const IFPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      return next;
    });
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      soundManager.setEnabled(next);
      return next;
    });
  };

  const togglePresentationMode = () => {
    setPresentationMode(prev => !prev);
  };

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // ignore
      }
    }
  };

  return (
    <IFPContext.Provider value={{
      isFullscreen,
      highContrast,
      soundEnabled,
      presentationMode,
      toggleFullscreen,
      toggleHighContrast,
      toggleSound,
      togglePresentationMode,
      triggerHaptic
    }}>
      {children}
    </IFPContext.Provider>
  );
};

export const useIFP = () => {
  const ctx = useContext(IFPContext);
  if (!ctx) throw new Error('useIFP must be used within IFPProvider');
  return ctx;
};
