'use client';

import { Plus, Search, Warehouse, MapPin, Layers, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { formatNumber } from '@/lib/utils';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface WarehouseData {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  country: string | null;
  is_active: boolean;
  created_at: string;
}

function useWarehouses() {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as WarehouseData[];
    },
  });
}

function useZones() {
  return useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });
}

function useLocations() {
  return useQuery({
    queryKey: ['locations-count'],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { count, error } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
  });
}

export default function WarehousesPage() {
  const { data: warehouses, isLoading: warehousesLoading } = useWarehouses();
  const { data: zones } = useZones();
  const { data: locationsCount } = useLocations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Magazijnen</h1>
          <p className="text-muted-foreground">
            Beheer magazijnen en zone configuratie
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nieuw Magazijn
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Warehouse className="h-4 w-4" />
              Magazijnen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(warehouses?.length || 0, 0)}</div>
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
            <div className="text-2xl font-bold">{formatNumber(zones?.length || 0, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Actief
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(warehouses?.filter((w) => w.is_active).length || 0, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Locaties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(locationsCount || 0, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op naam of code..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Magazijn Overzicht</CardTitle>
        </CardHeader>
        <CardContent>
          {warehousesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : warehouses && warehouses.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Code</th>
                    <th className="p-3 text-left text-sm font-medium">Naam</th>
                    <th className="p-3 text-left text-sm font-medium">Adres</th>
                    <th className="p-3 text-left text-sm font-medium">Stad</th>
                    <th className="p-3 text-left text-sm font-medium">Land</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map((warehouse) => (
                    <tr key={warehouse.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{warehouse.code}</td>
                      <td className="p-3">{warehouse.name}</td>
                      <td className="p-3 text-muted-foreground">{warehouse.address || '-'}</td>
                      <td className="p-3">{warehouse.city || '-'}</td>
                      <td className="p-3">{warehouse.country || '-'}</td>
                      <td className="p-3">
                        <StatusBadge status={warehouse.is_active ? 'active' : 'inactive'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Geen magazijnen gevonden
            </div>
          )}
        </CardContent>
      </Card>

      {zones && zones.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Zones</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe Zone
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Naam</th>
                    <th className="p-3 text-left text-sm font-medium">Type</th>
                    <th className="p-3 text-left text-sm font-medium">Temperatuur</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone: { id: string; name: string; zone_type: string | null; temperature_controlled: boolean }) => (
                    <tr key={zone.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{zone.name}</td>
                      <td className="p-3 capitalize">{zone.zone_type || '-'}</td>
                      <td className="p-3">{zone.temperature_controlled ? 'Ja' : 'Nee'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
