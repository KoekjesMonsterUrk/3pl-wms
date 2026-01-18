'use client';

import { Settings, Building2, Users, Globe, Bell, Shield, Database } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const settingsSections = [
  {
    title: 'Algemeen',
    description: 'Basis instellingen en bedrijfsgegevens',
    icon: Settings,
    href: '/settings',
    items: [
      'Bedrijfsnaam en logo',
      'Taal en regio instellingen',
      'Standaard eenheden',
    ],
  },
  {
    title: 'Magazijnen',
    description: 'Beheer magazijnlocaties en zones',
    icon: Building2,
    href: '/settings/warehouses',
    items: [
      'Magazijnconfiguratie',
      'Zone indeling',
      'Locatie naamgeving',
    ],
  },
  {
    title: 'Gebruikers',
    description: 'Gebruikersbeheer en toegangsrechten',
    icon: Users,
    href: '/settings/users',
    items: [
      'Gebruikersaccounts',
      'Rollen en rechten',
      'Toegangscontrole',
    ],
  },
  {
    title: 'Integraties',
    description: 'API koppelingen en externe systemen',
    icon: Globe,
    href: '/settings',
    items: [
      'API sleutels',
      'Webhooks',
      'Externe koppelingen',
    ],
  },
  {
    title: 'Notificaties',
    description: 'E-mail en push notificaties',
    icon: Bell,
    href: '/settings',
    items: [
      'E-mail instellingen',
      'Alert configuratie',
      'Notificatie regels',
    ],
  },
  {
    title: 'Beveiliging',
    description: 'Beveiligingsinstellingen en audit logs',
    icon: Shield,
    href: '/settings',
    items: [
      'Wachtwoord beleid',
      'Twee-factor authenticatie',
      'Audit logging',
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instellingen</h1>
        <p className="text-muted-foreground">
          Beheer systeem- en bedrijfsinstellingen
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {section.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Systeem Informatie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm font-medium">Versie</div>
              <div className="text-2xl font-bold">1.0.0</div>
            </div>
            <div>
              <div className="text-sm font-medium">Database</div>
              <div className="text-2xl font-bold">Supabase</div>
            </div>
            <div>
              <div className="text-sm font-medium">Omgeving</div>
              <div className="text-2xl font-bold">Development</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
