// Componente Header principal
import { useItineraryStore } from '../../store/store';
import { Toggle } from '../ui';

export function Header() {
  const editMode = useItineraryStore((state) => state.editMode);
  const toggleEditMode = useItineraryStore((state) => state.toggleEditMode);

  return (
    <header className="gradient-header rounded-xl sm:rounded-2xl p-responsive shadow-dark-lg mb-4 sm:mb-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-responsive-3xl mb-2 sm:mb-3">
          <span className="text-4xl sm:text-5xl">🇪🇺</span> Itinerario Europa
        </h1>
        <p className="text-responsive-base text-white/90 mb-4 sm:mb-6 leading-relaxed px-2">
          Septiembre 2026 - Barcelona → París → Ámsterdam → Suiza → Milán → Venecia → Roma → Puglia → Madrid
          <span className="block mt-1 sm:inline sm:mt-0 sm:ml-1 text-white/80">(23 días)</span>
        </p>

        <div className="flex justify-center mt-4 sm:mt-6">
          <div className="glass inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full">
            <span className="text-white font-semibold text-sm sm:text-base">✏️ Modo Edición</span>
            <Toggle
              checked={editMode}
              onChange={toggleEditMode}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
