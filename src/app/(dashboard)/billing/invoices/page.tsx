'use client';

import { Plus, Search, Receipt, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { formatDate, formatCurrency, formatNumber } from '@/lib/utils';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  status: string;
  customer?: { name: string };
  created_at: string;
}

function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
  });
}

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();

  const totalAmount = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
  const paidAmount = invoices
    ?.filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
  const pendingAmount = invoices
    ?.filter((inv) => inv.status === 'pending' || inv.status === 'sent')
    .reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturen</h1>
          <p className="text-muted-foreground">
            Beheer en verzend facturen
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe Factuur
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Totaal Facturen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(invoices?.length || 0, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Totaal Bedrag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Betaald
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Openstaand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op factuurnummer of klant..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Factuur Overzicht</CardTitle>
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
          ) : invoices && invoices.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Factuur #</th>
                    <th className="p-3 text-left text-sm font-medium">Klant</th>
                    <th className="p-3 text-left text-sm font-medium">Factuurdatum</th>
                    <th className="p-3 text-left text-sm font-medium">Vervaldatum</th>
                    <th className="p-3 text-right text-sm font-medium">Bedrag</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{invoice.invoice_number}</td>
                      <td className="p-3">{invoice.customer?.name || '-'}</td>
                      <td className="p-3">{formatDate(invoice.invoice_date)}</td>
                      <td className="p-3">{formatDate(invoice.due_date)}</td>
                      <td className="p-3 text-right">{formatCurrency(invoice.total_amount)}</td>
                      <td className="p-3">
                        <StatusBadge status={invoice.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Geen facturen gevonden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
