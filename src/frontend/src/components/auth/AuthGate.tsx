import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Loader2 } from 'lucide-react';
import LoginButton from './LoginButton';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="mx-auto max-w-md space-y-6 text-center px-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Wealth Management Portal
            </h1>
            <p className="text-muted-foreground">
              Secure access to your personal wealth and asset management dashboard
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
            <p className="mb-6 text-sm text-muted-foreground">
              Please authenticate to access your financial data
            </p>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
