'use client';

import { useState } from 'react';
import { Search, Play, CheckCircle, Clock, User, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePickTasks } from '@/hooks/usePicking';
import { formatDate } from '@/lib/utils';

export default function PickingPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: tasks, isLoading } = usePickTasks({ status: statusFilter, search: searchQuery });

  const statusOptions = [
    { value: 'all', label: 'Alle taken' },
    { value: 'pending', label: 'In wachtrij' },
    { value: 'assigned', label: 'Toegewezen' },
    { value: 'in_progress', label: 'Bezig' },
    { value: 'completed', label: 'Voltooid' },
  ];

  const stats = {
    pending: tasks?.filter(t => t.status === 'pending').length || 0,
    inProgress: tasks?.filter(t => t.status === 'in_progress').length || 0,
    completed: tasks?.filter(t => t.status === 'completed').length || 0,
    total: tasks?.length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pick Taken</h1>
          <p className="text-muted-foreground">
            Beheer en voer pick taken uit voor uitgaande orders
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Wachtrij</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bezig</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <Play className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Voltooid Vandaag</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Totaal Taken</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op order, product of locatie..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pick Taken</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : tasks && tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{task.product?.name || 'Product'}</span>
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority as 'low' | 'normal' | 'high' | 'urgent'} />
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {task.from_location?.code || 'Locatie'}
                        </span>
                        <span>Qty: {task.quantity}</span>
                        <span>Order: {task.order?.order_number || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      {task.assigned_user ? (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <User className="h-3 w-3" />
                          {task.assigned_user.full_name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Niet toegewezen</span>
                      )}
                      <div className="text-muted-foreground">
                        {formatDate(task.created_at)}
                      </div>
                    </div>
                    {task.status === 'pending' && (
                      <Button size="sm">Start Pick</Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button size="sm" variant="success">
                        Voltooi
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Geen pick taken gevonden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
