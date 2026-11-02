// App.jsx - Componente principal de la aplicación
import { useEffect, useState } from 'react';
import { useItineraryStore } from './store/store';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Controls from './components/controls/Controls';
import SummaryView from './views/SummaryView';
import AllDaysView from './views/AllDaysView';
import DayView from './views/DayView';
import JavierPlannerView from './views/JavierPlannerView';
import { Spinner } from './components/ui';
import useKeyboardNav from './hooks/useKeyboardNav';

function App() {
  const currentView = useItineraryStore((state) => state.currentView);
  const currentDay = useItineraryStore((state) => state.currentDay);
  const [historyReady, setHistoryReady] = useState(false);
  const isLoading = useItineraryStore((state) => state.isLoading);
  const error = useItineraryStore((state) => state.error);
  const loadItinerary = useItineraryStore((state) => state.loadItinerary);

  // Cargar datos al montar
  useEffect(() => {
    loadItinerary();
  }, [loadItinerary]);


  // Sincronizar las vistas con el historial real del navegador (incluidos
  // los botones laterales Atrás/Adelante del mouse y los gestos del móvil).
  // Las rutas quedan en el query string: ?view=day&day=3, sin afectar GitHub Pages.
  useEffect(() => {
    const restoreFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const day = Number(params.get('day'));
      const store = useItineraryStore.getState();

      if (view === 'day' && Number.isInteger(day) && day > 0) {
        if (store.currentView !== 'day' || store.currentDay !== day) {
          store.setCurrentDay(day);
        }
      } else {
        // La vista privada solo puede restaurarse si se desbloqueó en esta sesión.
        const nextView = view === 'all' || (view === 'javier' && store.javierUnlocked)
          ? view
          : 'summary';
        if (store.currentView !== nextView) store.setCurrentView(nextView);
      }
    };

    restoreFromUrl();
    window.addEventListener('popstate', restoreFromUrl);
    setHistoryReady(true);
    return () => window.removeEventListener('popstate', restoreFromUrl);
  }, []);

  useEffect(() => {
    if (!historyReady) return;

    const url = new URL(window.location.href);
    const viewInUrl = url.searchParams.get('view') || 'summary';
    const dayInUrl = Number(url.searchParams.get('day'));

    // Al volver con el navegador, la URL ya corresponde a la vista restaurada:
    // no crear una entrada adicional que rompa Atrás/Adelante.
    if (viewInUrl === currentView &&
        (currentView !== 'day' || dayInUrl === currentDay)) return;

    if (currentView === 'summary') {
      url.searchParams.delete('view');
      url.searchParams.delete('day');
    } else {
      url.searchParams.set('view', currentView);
      if (currentView === 'day') {
        url.searchParams.set('day', String(currentDay));
      } else {
        url.searchParams.delete('day');
      }
    }

    window.history.pushState(
      { travelView: currentView, travelDay: currentView === 'day' ? currentDay : null },
      '',
      url.pathname + url.search + url.hash
    );
    window.scrollTo(0, 0);
  }, [historyReady, currentView, currentDay]);

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

  if (currentView === 'javier') {
    return <JavierPlannerView />;
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
