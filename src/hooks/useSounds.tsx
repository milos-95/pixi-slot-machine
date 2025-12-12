import { useCallback, useEffect, useRef } from 'react';

//Sounds
import spinClickSound from '../assets/sounds/spin-click.mp3';
import spinStartSound from '../assets/sounds/spin-start.mp3';
import winSound from '../assets/sounds/win.mp3';

export const useSounds = () => {
  const audioContextReady = useRef(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      audioContextReady.current = true;
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    // Add listeners for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  const playSound = useCallback((soundName: string, volume: number = 0.5) => {
    if (!audioContextReady.current) return;

    let audioSrc: string;
    
    switch (soundName) {
      case 'spin-click':
        audioSrc = spinClickSound;
        break;
      case 'spin-start':
        audioSrc = spinStartSound;
        break;
      case 'win':
        audioSrc = winSound;
        break;
      default:
        return;
    }

    const audio = new Audio(audioSrc);
    audio.volume = volume;
    
    // Play the sound
    audio.play().catch(err => {
      console.warn('Audio play failed:', err);
    });
  }, []);

  return { playSound };
};