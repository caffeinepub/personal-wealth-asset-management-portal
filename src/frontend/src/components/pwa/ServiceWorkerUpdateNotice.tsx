import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useServiceWorkerUpdate } from '@/pwa/useServiceWorkerUpdate';

export default function ServiceWorkerUpdateNotice() {
  const { updateAvailable, applyUpdate } = useServiceWorkerUpdate();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <div className="rounded-lg border border-primary/20 bg-card p-4 shadow-lg shadow-primary/10">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <RefreshCw className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium">Update Available</p>
            <p className="text-xs text-muted-foreground">
              A new version is available. Refresh to update now.
            </p>
            <Button
              onClick={applyUpdate}
              size="sm"
              className="w-full"
            >
              Refresh Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

