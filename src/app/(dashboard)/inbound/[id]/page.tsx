'use client';

import { use } from 'react';
import { ArrowLeft, CheckCircle, Clock, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useInboundOrder, useUpdateInboundOrderStatus } from '@/hooks/useOrders';
import { formatDate, formatNumber } from '@/lib/utils';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InboundOrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: order, isLoading } = useInboundOrder(id);
  const updateStatus = useUpdateInboundOrderStatus();

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      toast.success('Status bijgewerkt');
    } catch {
      toast.error('Fout bij bijwerken status');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Order niet gevonden</h2>
        <Button asChild className="mt-4">
          <Link href="/inbound">Terug naar overzicht</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/inbound">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{order.order_number}</h1>
            <p className="text-muted-foreground">
              {order.reference_number || 'Geen referentie'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Verwacht
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(order.expected_date)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Ontvangen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {order.received_date ? formatDate(order.received_date) : '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Regels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{order.lines?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Orderregels</CardTitle>
          {order.status === 'pending' && (
            <Button onClick={() => handleStatusUpdate('in_transit')}>
              <Truck className="mr-2 h-4 w-4" />
              Markeer als onderweg
            </Button>
          )}
          {order.status === 'in_transit' && (
            <Button onClick={() => handleStatusUpdate('receiving')}>
              <Package className="mr-2 h-4 w-4" />
              Start ontvangst
            </Button>
          )}
          {order.status === 'receiving' && (
            <Button onClick={() => handleStatusUpdate('received')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Ontvangst voltooien
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {order.lines && order.lines.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">#</th>
                    <th className="p-3 text-left text-sm font-medium">Product</th>
                    <th className="p-3 text-left text-sm font-medium">SKU</th>
                    <th className="p-3 text-right text-sm font-medium">Verwacht</th>
                    <th className="p-3 text-right text-sm font-medium">Ontvangen</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lines.map((line) => (
                    <tr key={line.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{line.line_number}</td>
                      <td className="p-3 font-medium">{line.product?.name || '-'}</td>
                      <td className="p-3 text-muted-foreground">{line.product?.sku || '-'}</td>
                      <td className="p-3 text-right">{formatNumber(line.expected_quantity, 0)}</td>
                      <td className="p-3 text-right">{formatNumber(line.received_quantity, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Geen orderregels gevonden
            </div>
          )}
        </CardContent>
      </Card>

      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
