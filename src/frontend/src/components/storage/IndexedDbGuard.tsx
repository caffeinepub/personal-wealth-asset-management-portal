import { useEffect, useState } from 'react';
import { isIndexedDBAvailable } from '@/storage/indexedDb';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IndexedDbGuardProps {
  children: React.ReactNode;
}

export default function IndexedDbGuard({ children }: IndexedDbGuardProps) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAvailability() {
      try {
        const available = await isIndexedDBAvailable();
        if (mounted) {
          setIsAvailable(available);
          setIsChecking(false);
        }
      } catch (error) {
        console.error('IndexedDB availability check failed:', error);
        if (mounted) {
          setIsAvailable(false);
          setIsChecking(false);
        }
      }
    }

    checkAvailability();

    return () => {
      mounted = false;
    };
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Initializing storage...</p>
        </div>
      </div>
    );
  }

  if (isAvailable === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              Storage Not Available
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Local Storage Required</AlertTitle>
              <AlertDescription>
                This application requires IndexedDB storage to function, but it is not available in your current environment.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="font-semibold">Common Causes:</h3>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>File Protocol:</strong> You are opening the app directly from the file system (file://).
                  This app must be served from a local web server.
                </li>
                <li>
                  <strong>Private/Incognito Mode:</strong> Some browsers disable storage in private browsing mode.
                </li>
                <li>
                  <strong>Browser Settings:</strong> Storage may be disabled in your browser settings.
                </li>
              </ul>
            </div>

            <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h3 className="font-semibold text-primary">Solution:</h3>
              <div className="space-y-2 text-sm">
                <p>To run this application, you must use one of the provided local server scripts:</p>
                <div className="rounded bg-background p-3 font-mono text-xs">
                  <p className="text-muted-foreground">Windows:</p>
                  <p className="mt-1">• Double-click <strong>start-server-win.bat</strong></p>
                  <p>• Or run <strong>start-server-win.ps1</strong> in PowerShell</p>
                  <p className="mt-2 text-muted-foreground">Then open:</p>
                  <p className="mt-1 text-primary">http://localhost:3000</p>
                </div>
                <p className="text-muted-foreground">
                  See <strong>WINDOWS_RUN_INSTRUCTIONS.txt</strong> for detailed setup instructions.
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>After starting the local server, refresh this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
