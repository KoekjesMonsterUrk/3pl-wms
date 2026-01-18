'use client';

import { useState } from 'react';
import { Plus, Search, MapPin, Grid3X3, LayoutGrid, Filter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocations } from '@/hooks/useInventory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LocationsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { data: locations, isLoading } = useLocations();

  const filteredLocations = locations?.filter(location => {
    const matchesSearch = searchQuery === '' ||
      location.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.aisle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || location.location_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const locationTypes = [
    { value: 'all', label: 'Alle Types' },
    { value: 'receiving', label: 'Ontvangst' },
    { value: 'storage', label: 'Opslag' },
    { value: 'picking', label: 'Pick' },
    { value: 'packing', label: 'Pack' },
    { value: 'shipping', label: 'Verzending' },
    { value: 'staging', label: 'Staging' },
    { value: 'bulk', label: 'Bulk' },
    { value: 'quarantine', label: 'Quarantaine' },
  ];

  const stats = {
    total: locations?.length || 0,
    available: locations?.filter(l => l.is_available).length || 0,
    occupied: locations?.filter(l => l.current_utilization > 0).length || 0,
    full: locations?.filter(l => l.current_utilization >= 100).length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Magazijn Locaties</h1>
          <p className="text-muted-foreground">
            Beheer alle locaties in het magazijn
          </p>
        </div>
        <Button asChild>
          <Link href="/locations/new">
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe Locatie
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Totaal Locaties</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Beschikbaar</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bezet</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.occupied}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vol</p>
                <p className="text-2xl font-bold text-red-600">{stats.full}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op code, naam of gang..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {locationTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon-sm"
            onClick={() => setViewMode('list')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon-sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Locaties ({filteredLocations?.length || 0})</CardTitle>
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
          ) : filteredLocations && filteredLocations.length > 0 ? (
            viewMode === 'list' ? (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left text-sm font-medium">Code</th>
                      <th className="p-3 text-left text-sm font-medium">Zone</th>
                      <th className="p-3 text-left text-sm font-medium">Gang</th>
                      <th className="p-3 text-left text-sm font-medium">Rek</th>
                      <th className="p-3 text-left text-sm font-medium">Level</th>
                      <th className="p-3 text-left text-sm font-medium">Type</th>
                      <th className="p-3 text-left text-sm font-medium">Bezetting</th>
                      <th className="p-3 text-left text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLocations.map((location) => (
                      <tr key={location.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <Link
                            href={`/locations/${location.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {location.code}
                          </Link>
                        </td>
                        <td className="p-3">{location.zone?.name || '-'}</td>
                        <td className="p-3">{location.aisle}</td>
                        <td className="p-3">{location.rack}</td>
                        <td className="p-3">{location.level}</td>
                        <td className="p-3">
                          <span className="capitalize">{location.location_type}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-muted">
                              <div
                                className={`h-2 rounded-full ${
                                  location.current_utilization >= 90
                                    ? 'bg-red-500'
                                    : location.current_utilization >= 50
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(location.current_utilization, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm">{location.current_utilization}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <StatusBadge
                            status={location.is_available ? 'available' : 'occupied'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filteredLocations.map((location) => (
                  <Link
                    key={location.id}
                    href={`/locations/${location.id}`}
                    className="block rounded-lg border p-4 hover:bg-muted/50 hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">{location.code}</span>
                      <div
                        className={`h-3 w-3 rounded-full ${
                          location.is_available ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Zone: {location.zone?.name || '-'}</p>
                      <p>Type: {location.location_type}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-2 flex-1 rounded-full bg-muted">
                          <div
                            className={`h-2 rounded-full ${
                              location.current_utilization >= 90
                                ? 'bg-red-500'
                                : location.current_utilization >= 50
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(location.current_utilization, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs">{location.current_utilization}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
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
