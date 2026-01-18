'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="nl">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="mb-2 text-xl font-semibold text-foreground">
                Kritieke fout
              </h1>
              <p className="mb-4 text-sm text-muted-foreground">
                Er is een kritieke fout opgetreden in de applicatie.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 rounded-md bg-muted p-3 text-left">
                  <p className="font-mono text-xs text-muted-foreground break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                      Digest: {error.digest}
                    </p>
                  )}
                </div>
              )}
              <button
                onClick={reset}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Opnieuw proberen
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
