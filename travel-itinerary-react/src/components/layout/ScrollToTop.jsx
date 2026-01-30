// Componente ScrollToTop button
import { useState, useEffect } from 'react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="
        fixed bottom-6 right-6 z-50
        w-12 h-12 rounded-full
        bg-purple-600 text-white text-xl font-bold
        shadow-dark-lg hover:shadow-xl
        hover:scale-110 active:scale-95
        transition-all duration-300
        flex items-center justify-center
        animate-fade-in
      "
      aria-label="Volver arriba"
    >
      ↑
    </button>
  );
}

export default ScrollToTop;
