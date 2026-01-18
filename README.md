# 3PL Warehouse Management System

Een enterprise-grade Warehouse Management System (WMS) voor Third-Party Logistics (3PL) providers, gebouwd met Next.js 16, React 19, Supabase en Tailwind CSS.

## Features

- **Dashboard** - Real-time overzicht van warehouse operaties
- **Inbound Management** - ASN ontvangst, kwaliteitscontrole, putaway
- **Outbound Management** - Order picking, packing, shipping
- **Inventory Management** - Voorraad tracking, cycle counts, locatiebeheer
- **Wave Planning** - Batch picking en order groupering
- **Producten** - SKU beheer met lot/serial tracking
- **Klanten** - Multi-tenant klantbeheer
- **Facturatie** - Contracten en facturering
- **Rapportage** - Analytics en KPI dashboards
- **Scanner** - Barcode scanning voor warehouse operaties
- **AI Assistent** - Intelligente warehouse assistent (optioneel)

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Frontend**: React 19, Tailwind CSS 4, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State**: Zustand, TanStack Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Animations**: Framer Motion

## Vereisten

- Node.js 20+
- npm of pnpm
- Supabase account (gratis tier voldoende voor development)

## Installatie

1. **Clone de repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Configureer environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Vul de volgende variabelen in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` - Je Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Je Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Je Supabase service role key

4. **Database setup**

   Voer de migratie uit in je Supabase SQL Editor:
   ```bash
   # Kopieer inhoud van supabase/migrations/001_initial_schema.sql
   # Plak en voer uit in Supabase SQL Editor
   ```

   Voer daarna de seed data uit:
   ```bash
   # Kopieer inhoud van supabase/seed/001_demo_data.sql
   # Plak en voer uit in Supabase SQL Editor
   ```

5. **Start de development server**
   ```bash
   npm run dev
   ```

6. **Open de applicatie**

   Ga naar [http://localhost:3000](http://localhost:3000)

## Scripts

| Commando | Beschrijving |
|----------|--------------|
| `npm run dev` | Start development server |
| `npm run build` | Build voor productie |
| `npm run start` | Start productie server |
| `npm run lint` | Voer ESLint uit |

## Project Structuur

```
src/
├── app/                    # Next.js App Router pagina's
│   ├── (auth)/            # Authenticatie pagina's
│   ├── (dashboard)/       # Dashboard en features
│   └── api/               # API routes
├── components/            # React componenten
│   ├── layout/           # Layout componenten
│   └── ui/               # UI componenten (shadcn/ui)
├── lib/                   # Utilities en configuratie
│   ├── supabase/         # Supabase client
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Helper functies
└── types/                # TypeScript type definities
```

## Database Schema

De applicatie gebruikt de volgende hoofdtabellen:

- `tenants` - Multi-tenant organisaties
- `users` - Gebruikers per tenant
- `warehouses` - Warehouse configuratie
- `locations` - Opslaglocaties (aisle/rack/level)
- `products` - Product master data
- `customers` - Klanten per tenant
- `inventory` - Voorraadposities
- `inbound_orders` - Inkomende ASN's
- `outbound_orders` - Uitgaande orders
- `pick_tasks` - Pick opdrachten
- `waves` - Wave planning

## Demo Gebruikers

Na het uitvoeren van de seed data zijn de volgende gebruikers beschikbaar:

| Rol | Email | Beschrijving |
|-----|-------|--------------|
| Admin | admin@demo.com | Volledige toegang |
| Manager | manager@demo.com | Warehouse management |
| Operator | operator@demo.com | Dagelijkse operaties |

## Environment Variables

Zie `.env.example` voor alle beschikbare configuratie opties:

- **Supabase**: Database en authenticatie
- **AI**: Optionele Anthropic API voor AI features
- **Feature Flags**: Schakel features in/uit
- **Localization**: Taal en regio instellingen

## Deployment

### Vercel (Aanbevolen)

1. Push naar GitHub/GitLab
2. Importeer in Vercel
3. Configureer environment variables
4. Deploy

### Docker

```bash
docker build -t 3pl-wms .
docker run -p 3000:3000 3pl-wms
```

## Licentie

MIT
