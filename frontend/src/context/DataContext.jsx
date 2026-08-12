import { createContext, useContext, useState, useCallback } from 'react';

/**
 * DataContext — contexte global de rafraîchissement des données.
 * Utilisez `useData().refresh()` après chaque action (ajout/suppression)
 * pour que tous les composants qui dépendent de `tick` se re-fetchen.
 */
const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setTick(t => t + 1);
  }, []);

  return (
    <DataContext.Provider value={{ tick, refresh }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
};
