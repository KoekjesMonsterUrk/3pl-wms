'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateInboundOrder } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useInventory';
import { toast } from 'sonner';

interface OrderLine {
  product_id: string;
  expected_quantity: number;
}

export default function NewInboundOrderPage() {
  const router = useRouter();
  const createOrder = useCreateInboundOrder();
  const { data: products } = useProducts();

  const [formData, setFormData] = useState({
    customer_id: '',
    warehouse_id: '',
    expected_date: '',
    reference_number: '',
    notes: '',
  });

  const [lines, setLines] = useState<OrderLine[]>([
    { product_id: '', expected_quantity: 1 },
  ]);

  const addLine = () => {
    setLines([...lines, { product_id: '', expected_quantity: 1 }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof OrderLine, value: string | number) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validLines = lines.filter((line) => line.product_id && line.expected_quantity > 0);

    if (validLines.length === 0) {
      toast.error('Voeg minimaal één orderregel toe');
      return;
    }

    try {
      await createOrder.mutateAsync({
        ...formData,
        lines: validLines,
      });
      toast.success('Inbound order aangemaakt');
      router.push('/inbound');
    } catch {
      toast.error('Fout bij aanmaken order');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/inbound">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nieuwe Inbound Order</h1>
          <p className="text-muted-foreground">
            Maak een nieuwe inkomende order aan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Informatie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reference_number">Referentienummer</Label>
                <Input
                  id="reference_number"
                  placeholder="PO-12345"
                  value={formData.reference_number}
                  onChange={(e) =>
                    setFormData({ ...formData, reference_number: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_date">Verwachte datum</Label>
                <Input
                  id="expected_date"
                  type="date"
                  value={formData.expected_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expected_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notities</Label>
              <Input
                id="notes"
                placeholder="Optionele notities..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Orderregels</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addLine}>
              <Plus className="mr-2 h-4 w-4" />
              Regel toevoegen
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lines.map((line, index) => (
                <div key={index} className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Product</Label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={line.product_id}
                      onChange={(e) => updateLine(index, 'product_id', e.target.value)}
                    >
                      <option value="">Selecteer product...</option>
                      {products?.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.sku} - {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Aantal</Label>
                    <Input
                      type="number"
                      min={1}
                      value={line.expected_quantity}
                      onChange={(e) =>
                        updateLine(index, 'expected_quantity', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeLine(index)}
                    disabled={lines.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/inbound">Annuleren</Link>
          </Button>
          <Button type="submit" disabled={createOrder.isPending}>
            {createOrder.isPending ? 'Bezig...' : 'Order aanmaken'}
          </Button>
        </div>
      </form>
    </div>
  );
}
