'use client';

import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useInventory';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Producten</h1>
          <p className="text-muted-foreground">
            Beheer het productassortiment
          </p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Nieuw Product
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op naam of SKU..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Producten</CardTitle>
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
          ) : products && products.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">SKU</th>
                    <th className="p-3 text-left text-sm font-medium">Naam</th>
                    <th className="p-3 text-left text-sm font-medium">Categorie</th>
                    <th className="p-3 text-left text-sm font-medium">Eenheid</th>
                    <th className="p-3 text-left text-sm font-medium">Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {product.sku}
                        </Link>
                      </td>
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.category || '-'}</td>
                      <td className="p-3">{product.unit_of_measure}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {product.requires_lot_tracking && (
                            <Badge variant="outline">Lot</Badge>
                          )}
                          {product.requires_serial_tracking && (
                            <Badge variant="outline">Serienr</Badge>
                          )}
                          {product.requires_expiry_tracking && (
                            <Badge variant="outline">Vervaldatum</Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Geen producten gevonden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
