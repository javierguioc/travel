import { useEffect } from 'react';
import { useItineraryStore } from '../store/store';

export function useKeyboardNav() {
  const currentView = useItineraryStore((state) => state.currentView);
  const currentDay = useItineraryStore((state) => state.currentDay);
  const setCurrentDay = useItineraryStore((state) => state.setCurrentDay);
  const itineraryData = useItineraryStore((state) => state.itineraryData);

  const totalDays = itineraryData?.days?.length || 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Solo en vista de día individual
      if (currentView !== 'day') return;

      // Ignorar si hay input/textarea enfocado
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'ArrowLeft' && currentDay > 1) {
        e.preventDefault();
        setCurrentDay(currentDay - 1);
      } else if (e.key === 'ArrowRight' && currentDay < totalDays) {
        e.preventDefault();
        setCurrentDay(currentDay + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, currentDay, totalDays, setCurrentDay]);
}

export default useKeyboardNav;
