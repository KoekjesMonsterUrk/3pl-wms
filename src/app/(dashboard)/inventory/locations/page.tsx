'use client';

import { Plus, Search, MapPin, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocations } from '@/hooks/useInventory';
import { formatNumber } from '@/lib/utils';

export default function LocationsPage() {
  const { data: locations, isLoading } = useLocations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locaties</h1>
          <p className="text-muted-foreground">
            Beheer magazijnlocaties en zones
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe Locatie
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Totaal Locaties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(locations?.length || 0, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(
                new Set(locations?.map((l) => l.zone_id).filter(Boolean)).size || 0,
                0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pick Locaties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(
                locations?.filter((l) => l.location_type === 'pick').length || 0,
                0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bulk Locaties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(
                locations?.filter((l) => l.location_type === 'bulk').length || 0,
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op locatiecode..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Locatie Overzicht</CardTitle>
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
          ) : locations && locations.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Code</th>
                    <th className="p-3 text-left text-sm font-medium">Zone</th>
                    <th className="p-3 text-left text-sm font-medium">Type</th>
                    <th className="p-3 text-left text-sm font-medium">Gang</th>
                    <th className="p-3 text-left text-sm font-medium">Rek</th>
                    <th className="p-3 text-left text-sm font-medium">Niveau</th>
                    <th className="p-3 text-left text-sm font-medium">Positie</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => (
                    <tr key={location.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{location.code}</td>
                      <td className="p-3">{location.zone?.name || '-'}</td>
                      <td className="p-3 capitalize">{location.location_type || '-'}</td>
                      <td className="p-3">{location.aisle || '-'}</td>
                      <td className="p-3">{location.rack || '-'}</td>
                      <td className="p-3">{location.level || '-'}</td>
                      <td className="p-3">{location.position || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Geen locaties gevonden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
