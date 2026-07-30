import { useState, useEffect } from 'react';

export const usePersistentTab = (storageKey, defaultTab) => {
  const [tab, setTab] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTab;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, tab);
  }, [tab, storageKey]);

  return [tab, setTab];
};
