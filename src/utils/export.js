// Utilidades para exportar e importar datos
import { calculateDayTotal } from './calculations';

export function exportJSON(itineraryData) {
  const dataStr = JSON.stringify(itineraryData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `itinerario_europa_${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function exportCSV(itineraryData, exchangeRate, showCOPConversion) {
  const headers = showCOPConversion
    ? ['Día', 'Fecha', 'Ciudad', 'Total Base USD', 'Total Real USD', 'Total Base COP', 'Total Real COP', 'Acum Base USD', 'Acum Real USD']
    : ['Día', 'Fecha', 'Ciudad', 'Total Base USD', 'Total Real USD', 'Acum Base USD', 'Acum Real USD'];

  const rows = [headers.join(',')];

  let accumBase = 0;
  let accumReal = 0;

  itineraryData.days.forEach(day => {
    const totalBase = calculateDayTotal(day, false);
    const totalReal = calculateDayTotal(day, true);
    accumBase += totalBase;
    accumReal += totalReal;

    const row = showCOPConversion
      ? [
          day.day,
          day.date,
          day.city,
          totalBase.toFixed(2),
          totalReal.toFixed(2),
          (totalBase * exchangeRate).toFixed(0),
          (totalReal * exchangeRate).toFixed(0),
          accumBase.toFixed(2),
          accumReal.toFixed(2),
        ]
      : [
          day.day,
          day.date,
          day.city,
          totalBase.toFixed(2),
          totalReal.toFixed(2),
          accumBase.toFixed(2),
          accumReal.toFixed(2),
        ];

    rows.push(row.join(','));
  });

  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `presupuesto_europa_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

export function printPDF() {
  window.print();
}

export async function importJSON() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };

    input.click();
  });
}
