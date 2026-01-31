// Zustand store - Estado global de la aplicación
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { DEFAULT_START_DATE, DEFAULT_EXCHANGE_RATE, DEFAULT_SHOW_COP_CONVERSION, DEFAULT_USE_REALISTIC_COSTS, DATA_FILE_PATH } from '../constants/defaults';

export const useItineraryStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Data state
        itineraryData: null,
        isLoading: false,
        error: null,

        // View state
        currentView: 'summary', // 'summary' | 'all' | 'day'
        currentDay: 1,
        showRecommendations: false,

        // Filters
        searchTerm: '',
        showTransportOnly: false,
        useRealisticCosts: DEFAULT_USE_REALISTIC_COSTS,

        // Settings
        tripStartDate: new Date(DEFAULT_START_DATE),
        exchangeRate: DEFAULT_EXCHANGE_RATE,
        showCOPConversion: DEFAULT_SHOW_COP_CONVERSION,

        // Edit mode
        editMode: false,

        // Actions - Data loading
        loadItinerary: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(DATA_FILE_PATH);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            set({ itineraryData: data, isLoading: false });
          } catch (error) {
            set({ error: error.message, isLoading: false });
          }
        },

        // Actions - Views
        setCurrentView: (view) => set({ currentView: view }),
        setCurrentDay: (day) => set({ currentDay: day, currentView: 'day' }),
        toggleRecommendations: () => set((state) => ({ showRecommendations: !state.showRecommendations })),

        // Actions - Filters
        setSearchTerm: (term) => set({ searchTerm: term }),
        toggleTransportOnly: () => set((state) => ({ showTransportOnly: !state.showTransportOnly })),
        toggleCostMode: () => set((state) => ({ useRealisticCosts: !state.useRealisticCosts })),

        // Actions - Settings
        setTripStartDate: (date) => set({ tripStartDate: date }),
        setExchangeRate: (rate) => set({ exchangeRate: parseFloat(rate) || DEFAULT_EXCHANGE_RATE }),
        toggleCOPConversion: () => set((state) => ({ showCOPConversion: !state.showCOPConversion })),

        // Actions - Edit mode
        toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),

        updateActivity: (dayNum, activityIndex, field, value) => {
          const state = get();
          if (!state.itineraryData) return;

          const newData = JSON.parse(JSON.stringify(state.itineraryData)); // Deep clone
          const day = newData.days.find(d => d.day === dayNum);

          if (day && day.mainActivities[activityIndex]) {
            day.mainActivities[activityIndex][field] = value;
            set({ itineraryData: newData });
          }
        },

        addActivity: (dayNum) => {
          const state = get();
          if (!state.itineraryData) return;

          const newData = JSON.parse(JSON.stringify(state.itineraryData));
          const day = newData.days.find(d => d.day === dayNum);

          if (day) {
            day.mainActivities.push({
              name: 'Nueva actividad',
              start: '09:00',
              durationMin: 60,
              notes: '',
              link: '',
              imageUrl: '',
              imageQuery: '',
            });
            set({ itineraryData: newData });
          }
        },

        removeActivity: (dayNum, activityIndex) => {
          const state = get();
          if (!state.itineraryData) return;

          const newData = JSON.parse(JSON.stringify(state.itineraryData));
          const day = newData.days.find(d => d.day === dayNum);

          if (day && day.mainActivities[activityIndex]) {
            day.mainActivities.splice(activityIndex, 1);
            set({ itineraryData: newData });
          }
        },

        reorderActivities: (dayNum, oldIndex, newIndex) => {
          const state = get();
          if (!state.itineraryData) return;

          const newData = JSON.parse(JSON.stringify(state.itineraryData));
          const day = newData.days.find(d => d.day === dayNum);

          if (day) {
            const [removed] = day.mainActivities.splice(oldIndex, 1);
            day.mainActivities.splice(newIndex, 0, removed);
            set({ itineraryData: newData });
          }
        },

        updateCost: (dayNum, costField, value) => {
          const state = get();
          if (!state.itineraryData) return;

          const newData = JSON.parse(JSON.stringify(state.itineraryData));
          const day = newData.days.find(d => d.day === dayNum);

          if (day) {
            day.costs[costField] = parseFloat(value) || 0;

            // Recalcular totales
            day.totals.totalBase = day.costs.lodgingBase + day.costs.foodBase +
                                   day.costs.transportBase + day.costs.activitiesBase;
            day.totals.totalReal = day.costs.lodgingReal + day.costs.foodReal +
                                   day.costs.transportBase + day.costs.activitiesBase;

            set({ itineraryData: newData });
          }
        },

        updateDayField: (dayNum, field, value) => {
          const state = get();
          if (!state.itineraryData) return;

          const newData = JSON.parse(JSON.stringify(state.itineraryData));
          const day = newData.days.find(d => d.day === dayNum);

          if (day) {
            day[field] = value;
            set({ itineraryData: newData });
          }
        },

        // Action - Import data
        importData: (data) => {
          set({ itineraryData: data });
        },
      }),
      {
        name: 'itinerary-storage',
        partialize: (state) => ({
          itineraryData: state.itineraryData,
          currentDay: state.currentDay,
          tripStartDate: state.tripStartDate,
          exchangeRate: state.exchangeRate,
          showCOPConversion: state.showCOPConversion,
          useRealisticCosts: state.useRealisticCosts,
        }),
      }
    )
  )
);
