'use client';

import { Plus, Search, ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

// Placeholder data - would be replaced with actual hook
const mockCycleCounts = [
  {
    id: '1',
    count_number: 'CC-2026-001',
    location_code: 'A-01-01',
    status: 'pending',
    scheduled_date: '2026-01-20',
    counted_by: null,
    created_at: '2026-01-15',
  },
  {
    id: '2',
    count_number: 'CC-2026-002',
    location_code: 'A-01-02',
    status: 'in_progress',
    scheduled_date: '2026-01-18',
    counted_by: 'Jan de Vries',
    created_at: '2026-01-15',
  },
  {
    id: '3',
    count_number: 'CC-2026-003',
    location_code: 'B-02-01',
    status: 'completed',
    scheduled_date: '2026-01-17',
    counted_by: 'Pieter Jansen',
    created_at: '2026-01-14',
  },
];

export default function CycleCountsPage() {
  const isLoading = false;
  const cycleCounts = mockCycleCounts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cycle Counts</h1>
          <p className="text-muted-foreground">
            Plan en beheer voorraadtellingen
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe Telling
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Totaal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cycleCounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Gepland
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cycleCounts.filter((c) => c.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              In Uitvoering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cycleCounts.filter((c) => c.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Voltooid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cycleCounts.filter((c) => c.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op telling of locatie..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tellingen Overzicht</CardTitle>
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
          ) : cycleCounts.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Telling #</th>
                    <th className="p-3 text-left text-sm font-medium">Locatie</th>
                    <th className="p-3 text-left text-sm font-medium">Gepland</th>
                    <th className="p-3 text-left text-sm font-medium">Geteld door</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-left text-sm font-medium">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {cycleCounts.map((count) => (
                    <tr key={count.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{count.count_number}</td>
                      <td className="p-3">{count.location_code}</td>
                      <td className="p-3">{formatDate(count.scheduled_date)}</td>
                      <td className="p-3">{count.counted_by || '-'}</td>
                      <td className="p-3">
                        <StatusBadge status={count.status} />
                      </td>
                      <td className="p-3">
                        {count.status === 'pending' && (
                          <Button variant="ghost" size="sm">
                            Start
                          </Button>
                        )}
                        {count.status === 'in_progress' && (
                          <Button variant="ghost" size="sm">
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
              Geen tellingen gevonden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
