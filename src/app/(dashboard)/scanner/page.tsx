'use client';

import { useState } from 'react';
import { Scan, Package, MapPin, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type ScanMode = 'receive' | 'pick' | 'move' | 'count';

interface ScanResult {
  type: 'product' | 'location';
  code: string;
  name: string;
  details?: Record<string, string | number>;
}

export default function ScannerPage() {
  const [mode, setMode] = useState<ScanMode>('receive');
  const [scanInput, setScanInput] = useState('');
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const handleScan = () => {
    if (!scanInput.trim()) {
      toast.error('Voer een barcode in');
      return;
    }

    // Simulate scan result
    const isLocation = scanInput.startsWith('LOC-') || scanInput.match(/^[A-Z]-\d{2}-\d{2}$/);

    const result: ScanResult = isLocation
      ? {
          type: 'location',
          code: scanInput,
          name: `Locatie ${scanInput}`,
          details: { zone: 'A', type: 'Pick' },
        }
      : {
          type: 'product',
          code: scanInput,
          name: `Product ${scanInput}`,
          details: { sku: scanInput, quantity: Math.floor(Math.random() * 100) },
        };

    setLastScan(result);
    setScanHistory((prev) => [result, ...prev.slice(0, 9)]);
    setScanInput('');
    toast.success(`${result.type === 'location' ? 'Locatie' : 'Product'} gescand`);
  };

  const modes = [
    { id: 'receive' as const, label: 'Ontvangen', icon: Package, description: 'Scan producten voor inbound ontvangst' },
    { id: 'pick' as const, label: 'Picken', icon: ArrowRight, description: 'Scan voor order picking' },
    { id: 'move' as const, label: 'Verplaatsen', icon: MapPin, description: 'Verplaats voorraad tussen locaties' },
    { id: 'count' as const, label: 'Tellen', icon: CheckCircle, description: 'Cycle count uitvoeren' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scanner</h1>
        <p className="text-muted-foreground">
          Scan barcodes voor snelle magazijnoperaties
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`p-4 rounded-lg border text-left transition-colors ${
                mode === m.id
                  ? 'border-primary bg-primary/10'
                  : 'hover:bg-muted/50'
              }`}
            >
              <Icon className={`h-6 w-6 mb-2 ${mode === m.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="font-medium">{m.label}</div>
              <div className="text-sm text-muted-foreground">{m.description}</div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Scan Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Scan of voer barcode in..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                autoFocus
                className="text-lg"
              />
              <Button onClick={handleScan}>
                <Scan className="mr-2 h-4 w-4" />
                Scan
              </Button>
            </div>

            {lastScan && (
              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  {lastScan.type === 'product' ? (
                    <Package className="h-5 w-5 text-primary" />
                  ) : (
                    <MapPin className="h-5 w-5 text-primary" />
                  )}
                  <span className="font-medium">
                    {lastScan.type === 'product' ? 'Product' : 'Locatie'} Gescand
                  </span>
                </div>
                <div className="text-2xl font-bold">{lastScan.code}</div>
                <div className="text-muted-foreground">{lastScan.name}</div>
                {lastScan.details && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(lastScan.details).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-muted-foreground capitalize">{key}: </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {mode === 'receive' && lastScan?.type === 'product' && (
              <div className="flex gap-2">
                <Input type="number" placeholder="Aantal" defaultValue={1} className="w-24" />
                <Button className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Bevestig Ontvangst
                </Button>
              </div>
            )}

            {mode === 'pick' && lastScan?.type === 'product' && (
              <div className="p-3 rounded-lg border border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Scan nu de pick locatie</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scan Geschiedenis</CardTitle>
          </CardHeader>
          <CardContent>
            {scanHistory.length > 0 ? (
              <div className="space-y-2">
                {scanHistory.map((scan, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded border hover:bg-muted/50"
                  >
                    {scan.type === 'product' ? (
                      <Package className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{scan.code}</div>
                      <div className="text-sm text-muted-foreground">{scan.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nog geen scans uitgevoerd
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sneltoetsen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4 text-sm">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-muted font-mono">Enter</kbd>
              <span>Scan bevestigen</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-muted font-mono">Esc</kbd>
              <span>Annuleren</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-muted font-mono">Tab</kbd>
              <span>Volgende veld</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-muted font-mono">F1-F4</kbd>
              <span>Modus wisselen</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
