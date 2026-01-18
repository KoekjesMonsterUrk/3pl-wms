'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PackageCheck,
  Truck,
  Boxes,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Scan,
  BarChart3,
  Bot,
  ClipboardList,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Inbound',
    href: '/inbound',
    icon: Truck,
    children: [
      { title: 'Orders', href: '/inbound' },
      { title: 'Nieuw', href: '/inbound/new' },
    ],
  },
  {
    title: 'Outbound',
    href: '/outbound',
    icon: PackageCheck,
    children: [
      { title: 'Orders', href: '/outbound' },
      { title: 'Waves', href: '/outbound/waves' },
    ],
  },
  {
    title: 'Picking',
    href: '/picking',
    icon: ClipboardList,
  },
  {
    title: 'Locaties',
    href: '/locations',
    icon: MapPin,
  },
  {
    title: 'Voorraad',
    href: '/inventory',
    icon: Boxes,
    children: [
      { title: 'Overzicht', href: '/inventory' },
      { title: 'Locaties', href: '/inventory/locations' },
      { title: 'Tellingen', href: '/inventory/cycle-counts' },
    ],
  },
  {
    title: 'Producten',
    href: '/products',
    icon: Package,
  },
  {
    title: 'Klanten',
    href: '/customers',
    icon: Users,
  },
  {
    title: 'Facturatie',
    href: '/billing',
    icon: FileText,
    children: [
      { title: 'Contracten', href: '/billing/contracts' },
      { title: 'Facturen', href: '/billing/invoices' },
    ],
  },
  {
    title: 'Rapporten',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'Instellingen',
    href: '/settings',
    icon: Settings,
    children: [
      { title: 'Algemeen', href: '/settings' },
      { title: 'Gebruikers', href: '/settings/users' },
      { title: 'Magazijnen', href: '/settings/warehouses' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Boxes className="h-6 w-6 text-primary" />
            <span>3PL WMS</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn('ml-auto', collapsed && 'mx-auto')}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.title);

          return (
            <div key={item.href}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )}

              {hasChildren && isExpanded && !collapsed && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block rounded-md px-3 py-1.5 text-sm transition-colors',
                        pathname === child.href
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <Link
          href="/scanner"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Scan className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Scanner</span>}
        </Link>
        <Link
          href="/ai"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Bot className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>AI Assistent</span>}
        </Link>
      </div>
    </aside>
  );
}
