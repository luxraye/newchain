import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pulse.donorId';

interface DonorContextValue {
  donorId: string | null;
  isHydrated: boolean;
  setDonorId: (id: string) => void;
  clearDonor: () => void;
}

const DonorContext = createContext<DonorContextValue | undefined>(undefined);

export function DonorProvider({ children }: { children: React.ReactNode }) {
  const [donorId, setDonorIdState] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setDonorIdState(stored);
      })
      .catch(() => {
        // Ignore hydration errors; user can re-register.
      })
      .finally(() => setIsHydrated(true));
  }, []);

  const setDonorId = useCallback((id: string) => {
    setDonorIdState(id);
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {});
  }, []);

  const clearDonor = useCallback(() => {
    setDonorIdState(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  return (
    <DonorContext.Provider
      value={{ donorId, isHydrated, setDonorId, clearDonor }}
    >
      {children}
    </DonorContext.Provider>
  );
}

export function useDonor(): DonorContextValue {
  const ctx = useContext(DonorContext);
  if (!ctx) throw new Error('useDonor must be used within DonorProvider');
  return ctx;
}
