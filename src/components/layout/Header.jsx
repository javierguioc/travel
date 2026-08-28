// Componente Header principal
import { useRef, useState } from 'react';
import { useItineraryStore } from '../../store/store';
import { Toggle } from '../ui';
import { TRIPS, DEFAULT_TRIP } from '../../constants/defaults';

const REQUIRED_CLICKS = 4;
const CLICK_WINDOW_MS = 2500;

export function Header() {
  const editMode = useItineraryStore((state) => state.editMode);
  const toggleEditMode = useItineraryStore((state) => state.toggleEditMode);
  const setJavierUnlocked = useItineraryStore((s) => s.setJavierUnlocked);
  const loadJavierData = useItineraryStore((s) => s.loadJavierData);
  const setCurrentView = useItineraryStore((s) => s.setCurrentView);
  const currentTrip = useItineraryStore((s) => s.currentTrip);
  const setTrip = useItineraryStore((s) => s.setTrip);

  const trip = TRIPS[currentTrip] || TRIPS[DEFAULT_TRIP];

  const clickCountRef = useRef(0);
  const timerRef = useRef(null);
  const [glowing, setGlowing] = useState(false);

  const handleSecretClick = () => {
    clickCountRef.current += 1;
    clearTimeout(timerRef.current);

    if (clickCountRef.current >= REQUIRED_CLICKS) {
      clickCountRef.current = 0;
      setGlowing(true);
      loadJavierData();
      setJavierUnlocked(true);
      setTimeout(() => {
        setGlowing(false);
        setCurrentView('javier');
      }, 400);
      return;
    }

    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, CLICK_WINDOW_MS);
  };

  return (
    <header
      className={`relative bg-gradient-to-br ${trip.gradient} rounded-2xl p-responsive shadow-elevated mb-6 animate-fade-in overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl" />
      </div>

      <div className="relative">
        {/* Selector de viaje */}
        <div className="flex justify-center mb-5">
          <div className="bg-black/15 backdrop-blur-sm inline-flex items-center gap-1 p-1 rounded-full border border-white/10">
            {Object.values(TRIPS).map((t) => {
              const active = t.id === currentTrip;
              return (
                <button
                  key={t.id}
                  onClick={() => setTrip(t.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-white text-gray-800 shadow'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl sm:text-5xl">{trip.emoji}</span>
            </div>
          </div>
          <h1 className="text-responsive-3xl mb-3 text-white font-bold drop-shadow-lg">
            {trip.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-5 px-2">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white/90">📅 {trip.dateLabel}</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white/90">🗓️ {trip.daysLabel}</span>
          </div>
          <p className="text-responsive-base text-white/80 mb-6 leading-relaxed px-2 max-w-2xl mx-auto">
            {trip.route}
          </p>

          <div className="flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm inline-flex items-center gap-3 px-5 py-2.5 rounded-full shadow-lg border border-white/10">
              <span className="text-white font-semibold text-sm sm:text-base">✏️ Modo Edición</span>
              <Toggle
                checked={editMode}
                onChange={toggleEditMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Secret entry — subtle dot in corner, click 4x to unlock */}
      <button
        onClick={handleSecretClick}
        aria-hidden="true"
        className={`absolute bottom-3 right-4 w-3 h-3 rounded-full transition-all duration-300 ${
          glowing ? 'bg-white/60 shadow-[0_0_8px_3px_rgba(255,255,255,0.4)]' : 'bg-white/10 hover:bg-white/20'
        }`}
      />
    </header>
  );
}

export default Header;
