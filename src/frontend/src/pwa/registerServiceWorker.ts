type UpdateCallback = (registration: ServiceWorkerRegistration) => void;

let updateCallback: UpdateCallback | null = null;

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          // Check for updates periodically (every 60 seconds)
          setInterval(() => {
            registration.update();
          }, 60000);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed and waiting
                console.log('New service worker available');
                if (updateCallback) {
                  updateCallback(registration);
                }
              }
            });
          });

          // Check if there's already a waiting worker
          if (registration.waiting && navigator.serviceWorker.controller) {
            console.log('Service worker update already waiting');
            if (updateCallback) {
              updateCallback(registration);
            }
          }
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });

      // Listen for controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed, reloading page');
        window.location.reload();
      });
    });
  }
}

export function onServiceWorkerUpdate(callback: UpdateCallback) {
  updateCallback = callback;
}

export function activateServiceWorkerUpdate(registration: ServiceWorkerRegistration) {
  const waitingWorker = registration.waiting;
  if (waitingWorker) {
    // Tell the waiting service worker to skip waiting and become active
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  }
}

