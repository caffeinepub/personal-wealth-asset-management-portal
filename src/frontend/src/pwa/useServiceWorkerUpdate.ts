import { useEffect, useState } from 'react';
import { onServiceWorkerUpdate, activateServiceWorkerUpdate } from './registerServiceWorker';

export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    onServiceWorkerUpdate((reg) => {
      setUpdateAvailable(true);
      setRegistration(reg);
    });
  }, []);

  const applyUpdate = () => {
    if (registration) {
      activateServiceWorkerUpdate(registration);
    }
  };

  return {
    updateAvailable,
    applyUpdate,
  };
}

