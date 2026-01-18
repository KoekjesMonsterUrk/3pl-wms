'use client';

import { Plus, Search, FileText, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { formatDate, formatCurrency } from '@/lib/utils';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface Contract {
  id: string;
  contract_number: string;
  customer_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  billing_frequency: string;
  customer?: { name: string };
  created_at: string;
}

function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('billing_contracts')
        .select(`
          *,
          customer:customers(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Contract[];
    },
  });
}

export default function ContractsPage() {
  const { data: contracts, isLoading } = useContracts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contracten</h1>
          <p className="text-muted-foreground">
            Beheer klantcontracten en tarieven
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nieuw Contract
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Totaal Contracten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Actief
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contracts?.filter((c) => c.status === 'active').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Verloopt Binnenkort
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Maandelijkse Omzet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op contractnummer of klant..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Overzicht</CardTitle>
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
          ) : contracts && contracts.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Contract #</th>
                    <th className="p-3 text-left text-sm font-medium">Klant</th>
                    <th className="p-3 text-left text-sm font-medium">Startdatum</th>
                    <th className="p-3 text-left text-sm font-medium">Einddatum</th>
                    <th className="p-3 text-left text-sm font-medium">Frequentie</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{contract.contract_number}</td>
                      <td className="p-3">{contract.customer?.name || '-'}</td>
                      <td className="p-3">{formatDate(contract.start_date)}</td>
                      <td className="p-3">{contract.end_date ? formatDate(contract.end_date) : 'Onbepaald'}</td>
                      <td className="p-3 capitalize">{contract.billing_frequency || '-'}</td>
                      <td className="p-3">
                        <StatusBadge status={contract.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Geen contracten gevonden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
