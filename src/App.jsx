// App.jsx - Componente principal de la aplicación
import { useEffect } from 'react';
import { useItineraryStore } from './store/store';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Controls from './components/controls/Controls';
import SummaryView from './views/SummaryView';
import AllDaysView from './views/AllDaysView';
import DayView from './views/DayView';
import { Spinner } from './components/ui';
import useKeyboardNav from './hooks/useKeyboardNav';

function App() {
  const currentView = useItineraryStore((state) => state.currentView);
  const isLoading = useItineraryStore((state) => state.isLoading);
  const error = useItineraryStore((state) => state.error);
  const loadItinerary = useItineraryStore((state) => state.loadItinerary);

  // Cargar datos al montar
  useEffect(() => {
    loadItinerary();
  }, [loadItinerary]);

  // Habilitar navegación con teclado
  useKeyboardNav();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-dark-textSecondary mt-4">Cargando itinerario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error al cargar datos</h2>
          <p className="text-dark-textSecondary mb-6">{error}</p>
          <button
            onClick={loadItinerary}
            className="btn btn-primary"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container-app py-6">
        <Header />
        <Controls />

        <main className="mt-6">
          {currentView === 'summary' && <SummaryView />}
          {currentView === 'all' && <AllDaysView />}
          {currentView === 'day' && <DayView />}
        </main>

        <Footer />
      </div>
      <ScrollToTop />
    </div>
  );
}

export default App;
