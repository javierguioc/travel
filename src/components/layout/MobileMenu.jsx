// Componente MobileMenu - Menú hamburguesa para móvil
import { useState, useEffect } from 'react';
import { useItineraryStore } from '../../store/store';
import { useIsMobile } from '../../hooks/useMediaQuery';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const setCurrentView = useItineraryStore((state) => state.setCurrentView);
  const currentView = useItineraryStore((state) => state.currentView);

  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigate = (view) => {
    setCurrentView(view);
    setIsOpen(false);
  };

  if (!isMobile) return null;

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-blue-600 text-white rounded-xl shadow-card flex items-center justify-center md:hidden"
        aria-label="Menú"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-6 h-full overflow-y-auto">
          <h2 className="text-2xl font-bold text-light-text mb-6 mt-12">
            📱 Navegación
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => handleNavigate('summary')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                currentView === 'summary'
                  ? 'bg-blue-600 text-white'
                  : 'bg-light-bgTertiary text-light-text hover:bg-light-border'
              }`}
            >
              <span className="text-lg mr-2">🏠</span> Resumen General
            </button>

            <button
              onClick={() => handleNavigate('all')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                currentView === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-light-bgTertiary text-light-text hover:bg-light-border'
              }`}
            >
              <span className="text-lg mr-2">📅</span> Todos los Días
            </button>

            <button
              onClick={() => handleNavigate('day')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                currentView === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'bg-light-bgTertiary text-light-text hover:bg-light-border'
              }`}
            >
              <span className="text-lg mr-2">📍</span> Día Actual
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-light-border">
            <p className="text-light-textMuted text-sm text-center">
              Desliza desde el borde derecho<br />o toca el menú para cerrar
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
