// Componente Footer con botones de acción
import { useItineraryStore } from '../../store/store';
import { Button } from '../ui';
import { exportJSON, exportCSV, printPDF, importJSON } from '../../utils/export';
import { TRIPS, DEFAULT_TRIP } from '../../constants/defaults';

export function Footer() {
  const itineraryData = useItineraryStore((state) => state.itineraryData);
  const currentTrip = useItineraryStore((state) => state.currentTrip);
  const trip = TRIPS[currentTrip] || TRIPS[DEFAULT_TRIP];
  const exchangeRate = useItineraryStore((state) => state.exchangeRate);
  const showCOPConversion = useItineraryStore((state) => state.showCOPConversion);
  const importData = useItineraryStore((state) => state.importData);

  const handleSave = () => {
    alert('✅ Cambios guardados automáticamente');
  };

  const handleExportJSON = () => {
    if (itineraryData) {
      exportJSON(itineraryData);
    }
  };

  const handleImportJSON = async () => {
    try {
      const data = await importJSON();
      importData(data);
      alert('✅ Datos importados correctamente');
    } catch (error) {
      alert(`❌ Error al importar: ${error.message}`);
    }
  };

  const handleExportCSV = () => {
    if (itineraryData) {
      exportCSV(itineraryData, exchangeRate, showCOPConversion);
    }
  };

  return (
    <footer className="mt-8 sm:mt-12">
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 shadow-sm border border-light-border">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-xl">🛠️</span>
          </div>
          <h3 className="text-lg font-bold text-light-text">Herramientas</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <button
            onClick={handleSave}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <span className="text-2xl">💾</span>
            <span className="text-sm font-semibold">Guardar</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex flex-col items-center gap-2 p-4 bg-white text-light-text rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 border border-light-border"
          >
            <span className="text-2xl">📤</span>
            <span className="text-sm font-semibold">JSON</span>
          </button>
          <button
            onClick={handleImportJSON}
            className="flex flex-col items-center gap-2 p-4 bg-white text-light-text rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 border border-light-border"
          >
            <span className="text-2xl">📥</span>
            <span className="text-sm font-semibold">Importar</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <span className="text-2xl">📊</span>
            <span className="text-sm font-semibold">CSV</span>
          </button>
          <button
            onClick={printPDF}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 col-span-2 sm:col-span-1"
          >
            <span className="text-2xl">🖨️</span>
            <span className="text-sm font-semibold">PDF</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-light-textMuted text-xs sm:text-sm leading-relaxed">
            Los cambios se guardan automáticamente en el navegador
          </p>
          <p className="text-light-textSecondary text-xs mt-2 flex items-center justify-center gap-1">
            <span className="text-lg">🌍</span> {trip.emoji} {trip.title} • {trip.daysLabel} • {trip.dateLabel}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
