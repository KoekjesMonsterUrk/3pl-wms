'use client';

import { BarChart3, TrendingUp, Package, Truck, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatCurrency } from '@/lib/utils';

const reportCategories = [
  {
    title: 'Voorraad Rapporten',
    description: 'Overzichten van voorraadniveaus en bewegingen',
    icon: Package,
    reports: [
      { name: 'Voorraad Samenvatting', description: 'Huidige voorraadniveaus per product' },
      { name: 'Voorraad Verloop', description: 'Voorraadwijzigingen over tijd' },
      { name: 'Vervalrapport', description: 'Producten die binnenkort verlopen' },
      { name: 'Laagste Voorraad', description: 'Producten onder minimum niveau' },
    ],
  },
  {
    title: 'Order Rapporten',
    description: 'Analyse van inbound en outbound orders',
    icon: Truck,
    reports: [
      { name: 'Order Volume', description: 'Aantal orders per dag/week/maand' },
      { name: 'Order Doorlooptijd', description: 'Gemiddelde verwerkingstijd per order' },
      { name: 'Order Nauwkeurigheid', description: 'Percentage foutloze orders' },
      { name: 'Klant Analyse', description: 'Orders per klant overzicht' },
    ],
  },
  {
    title: 'Financiële Rapporten',
    description: 'Facturatie en omzet overzichten',
    icon: DollarSign,
    reports: [
      { name: 'Omzet Rapport', description: 'Totale omzet per periode' },
      { name: 'Openstaande Facturen', description: 'Achterstallige betalingen' },
      { name: 'Klant Omzet', description: 'Omzet per klant' },
      { name: 'Kosten Analyse', description: 'Kosten per activiteit' },
    ],
  },
  {
    title: 'Operationele Rapporten',
    description: 'Prestatie indicatoren en KPIs',
    icon: TrendingUp,
    reports: [
      { name: 'Magazijn Gebruik', description: 'Bezettingsgraad per zone' },
      { name: 'Locatie Efficiëntie', description: 'Pickfrequentie per locatie' },
      { name: 'Medewerker Productiviteit', description: 'Prestaties per gebruiker' },
      { name: 'Wave Analyse', description: 'Efficiëntie van picking waves' },
    ],
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapporten</h1>
          <p className="text-muted-foreground">
            Analyseer bedrijfsprestaties en genereer rapporten
          </p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Gepland Rapport
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Orders Vandaag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(0, 0)}</div>
            <p className="text-xs text-muted-foreground">+0% vs gisteren</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uitgaande Stuks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(0, 0)}</div>
            <p className="text-xs text-muted-foreground">+0% vs gisteren</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Omzet MTD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(0)}</div>
            <p className="text-xs text-muted-foreground">+0% vs vorige maand</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Order Nauwkeurigheid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Laatste 30 dagen</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {category.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.reports.map((report) => (
                    <button
                      key={report.name}
                      className="w-full flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors text-left"
                    >
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-muted-foreground">{report.description}</div>
                      </div>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
