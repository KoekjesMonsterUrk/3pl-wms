'use client';

import { useState } from 'react';
import { Plus, Search, Users, Building2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import type { Customer } from '@/types';
import { formatNumber } from '@/lib/utils';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function useCustomers(search?: string) {
  return useQuery({
    queryKey: ['customers', search],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      let query = supabase
        .from('customers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,code.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Customer[];
    },
  });
}

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const { data: customers, isLoading } = useCustomers(search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Klanten</h1>
          <p className="text-muted-foreground">
            Beheer klantgegevens en contracten
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe Klant
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Totaal Klanten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(customers?.length || 0, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Actief
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(customers?.filter((c) => c.is_active).length || 0, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Met Contract</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nieuwe (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op naam of email..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Klanten Overzicht</CardTitle>
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
          ) : customers && customers.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Code</th>
                    <th className="p-3 text-left text-sm font-medium">Naam</th>
                    <th className="p-3 text-left text-sm font-medium">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email
                    </th>
                    <th className="p-3 text-left text-sm font-medium">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Telefoon
                    </th>
                    <th className="p-3 text-left text-sm font-medium">Stad</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{customer.code || '-'}</td>
                      <td className="p-3">{customer.name}</td>
                      <td className="p-3 text-muted-foreground">{customer.contact?.email || '-'}</td>
                      <td className="p-3">{customer.contact?.phone || '-'}</td>
                      <td className="p-3">{customer.billing_address?.city || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Geen klanten gevonden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
