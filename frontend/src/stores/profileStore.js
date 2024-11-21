import create from 'zustand';
import { persist } from 'zustand/middleware';

const useProfileStore = create(
  persist(
    (set, get) => ({
      profiles: [],
      currentProfile: null,
      measurements: {},

      addProfile: (profile) => set((state) => ({
        profiles: [...state.profiles, profile],
        currentProfile: profile.id
      })),

      updateProfile: (id, data) => set((state) => ({
        profiles: state.profiles.map(p => 
          p.id === id ? { ...p, ...data } : p
        )
      })),

      setCurrentProfile: (id) => set({ currentProfile: id }),

      updateMeasurements: (measurements) => set((state) => ({
        profiles: state.profiles.map(p => 
          p.id === state.currentProfile 
            ? { ...p, measurements: { ...p.measurements, ...measurements } }
            : p
        )
      })),

      getCurrentProfile: () => {
        const state = get();
        return state.profiles.find(p => p.id === state.currentProfile);
      }
    }),
    {
      name: 'size-profiles',
      version: 1,
    }
  )
);

export default useProfileStore;