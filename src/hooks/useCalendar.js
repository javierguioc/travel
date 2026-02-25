import { useCallback } from 'react';
import { useItineraryStore } from '../store/store';
import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

export function useCalendar() {
  const tripStartDate = useItineraryStore((state) => state.tripStartDate);

  const calculateDayDate = useCallback(
    (dayNumber) => {
      return addDays(new Date(tripStartDate), dayNumber);
    },
    [tripStartDate]
  );

  const getFormattedDate = useCallback(
    (dayNumber) => {
      const date = calculateDayDate(dayNumber);
      return format(date, "EEE, d MMM yyyy", { locale: es });
    },
    [calculateDayDate]
  );

  const getShortDate = useCallback(
    (dayNumber) => {
      const date = calculateDayDate(dayNumber);
      return format(date, "d MMM", { locale: es });
    },
    [calculateDayDate]
  );

  const getMonthName = useCallback(
    (dayNumber) => {
      const date = calculateDayDate(dayNumber);
      return format(date, "MMMM", { locale: es });
    },
    [calculateDayDate]
  );

  return {
    tripStartDate,
    calculateDayDate,
    getFormattedDate,
    getShortDate,
    getMonthName,
  };
}

export default useCalendar;
