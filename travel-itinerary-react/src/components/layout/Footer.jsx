// Componente Footer con botones de acción
import { useItineraryStore } from '../../store/store';
import { Button } from '../ui';
import { exportJSON, exportCSV, printPDF, importJSON } from '../../utils/export';

export function Footer() {
  const itineraryData = useItineraryStore((state) => state.itineraryData);
  const exchangeRate = useItineraryStore((state) => state.exchangeRate);
  const showCOPConversion = useItineraryStore((state) => state.showCOPConversion);
  const importData = useItineraryStore((state) => state.importData);

  const handleSave = () => {
    // Los datos se guardan automáticamente con Zustand persist
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
    <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-dark-border">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 justify-center mb-4 sm:mb-6">
        <Button variant="primary" icon="💾" onClick={handleSave} size="sm" className="w-full sm:w-auto">
          <span className="hidden sm:inline">Guardar Cambios</span>
          <span className="sm:hidden">Guardar</span>
        </Button>
        <Button variant="secondary" icon="📤" onClick={handleExportJSON} size="sm" className="w-full sm:w-auto">
          <span className="hidden sm:inline">Exportar JSON</span>
          <span className="sm:hidden">JSON</span>
        </Button>
        <Button variant="secondary" icon="📥" onClick={handleImportJSON} size="sm" className="w-full sm:w-auto">
          <span className="hidden sm:inline">Importar JSON</span>
          <span className="sm:hidden">Importar</span>
        </Button>
        <Button variant="success" icon="📊" onClick={handleExportCSV} size="sm" className="w-full sm:w-auto">
          <span className="hidden sm:inline">Exportar CSV</span>
          <span className="sm:hidden">CSV</span>
        </Button>
        <Button variant="warning" icon="🖨️" onClick={printPDF} size="sm" className="w-full sm:w-auto col-span-2 sm:col-span-1">
          <span className="hidden sm:inline">Imprimir PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>

      <p className="text-center text-dark-textMuted text-xs sm:text-sm px-4 leading-relaxed">
        Los cambios se guardan automáticamente en el navegador.<br className="sm:hidden" />
        <span className="hidden sm:inline"> </span>Creado para el viaje de 23 días por Europa 🌍
      </p>
    </footer>
  );
}

export default Footer;
