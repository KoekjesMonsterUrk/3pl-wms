'use client';

import { Plus, Search, Play, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useWaves } from '@/hooks/useOrders';
import { formatDate, formatNumber } from '@/lib/utils';

export default function WavesPage() {
  const { data: waves, isLoading } = useWaves();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Waves</h1>
          <p className="text-muted-foreground">
            Beheer picking waves voor efficiënte orderverwerking
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe Wave
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Totaal Waves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(waves?.length || 0, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(waves?.filter((w) => w.status === 'draft').length || 0, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(waves?.filter((w) => w.status === 'in_progress').length || 0, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Voltooid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(waves?.filter((w) => w.status === 'completed').length || 0, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op wave nummer..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wave Overzicht</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : waves && waves.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Wave #</th>
                    <th className="p-3 text-left text-sm font-medium">Aangemaakt</th>
                    <th className="p-3 text-right text-sm font-medium">Orders</th>
                    <th className="p-3 text-right text-sm font-medium">Regels</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-left text-sm font-medium">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {waves.map((wave) => (
                    <tr key={wave.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{wave.wave_number}</td>
                      <td className="p-3">{formatDate(wave.created_at)}</td>
                      <td className="p-3 text-right">{formatNumber(wave.order_count, 0)}</td>
                      <td className="p-3 text-right">{formatNumber(wave.line_count, 0)}</td>
                      <td className="p-3">
                        <StatusBadge status={wave.status} />
                      </td>
                      <td className="p-3">
                        {wave.status === 'draft' && (
                          <Button variant="ghost" size="sm">
                            <Play className="mr-1 h-3 w-3" />
                            Start
                          </Button>
                        )}
                        {wave.status === 'in_progress' && (
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Voltooien
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Geen waves gevonden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
