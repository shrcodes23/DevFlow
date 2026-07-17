'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell, AtSign, Clock, Calendar, GitPullRequest, CircleDot,
  Sparkles, Settings as SettingsIcon, Check, CheckCheck, Loader2,
} from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { userById } from '@/lib/data';
import type { AppNotification, NotificationType } from '@/lib/types';
import { cn } from '@/lib/utils';

const typeMeta: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  mention: { icon: AtSign, color: 'text-primary', bg: 'bg-primary/10' },
  reminder: { icon: Clock, color: 'text-info', bg: 'bg-info/10' },
  'due-date': { icon: Calendar, color: 'text-warning', bg: 'bg-warning/10' },
  pr: { icon: GitPullRequest, color: 'text-chart-4', bg: 'bg-chart-4/10' },
  issue: { icon: CircleDot, color: 'text-destructive', bg: 'bg-destructive/10' },
  review: { icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10' },
  system: { icon: SettingsIcon, color: 'text-muted-foreground', bg: 'bg-muted' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3.6e6);
  if (h < 1) return Math.max(1, Math.floor(diff / 6e4)) + 'm ago';
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => { api.notifications.list().then(setItems); }, []);

  const markRead = async (id: string) => {
    setItems((prev) => prev?.map((n) => n.id === id ? { ...n, read: true } : n) ?? null);
    await api.notifications.markRead(id);
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    setItems((prev) => prev?.map((n) => ({ ...n, read: true })) ?? null);
    await api.notifications.markAllRead();
    setMarkingAll(false);
  };

  const filtered = items?.filter((n) => filter === 'all' ? true : !n.read);
  const unreadCount = items?.filter((n) => !n.read).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Mentions, reminders, due date alerts, and review requests."
        action={
          <Button variant="outline" onClick={markAllRead} disabled={markingAll || unreadCount === 0}>
            {markingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCheck className="mr-2 h-4 w-4" />}
            Mark all read
          </Button>
        }
      />

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn('rounded-lg px-3 py-1.5 text-sm font-medium transition-colors', filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}
        >All</button>
        <button
          onClick={() => setFilter('unread')}
          className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors', filter === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}
        >Unread {unreadCount > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-foreground/20 px-1 text-[10px]">{unreadCount}</span>}</button>
      </div>

      {!filtered ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="No notifications match this filter." />
      ) : (
        <div className="space-y-2">
          {filtered.map((n, i) => {
            const meta = typeMeta[n.type];
            const Icon = meta.icon;
            const actor = userById(n.actorId);
            return (
              <div
                key={n.id}
                className={cn(
                  'group flex items-start gap-3 rounded-xl border bg-card p-4 transition-all animate-fade-in',
                  n.read ? 'border-border opacity-70' : 'border-primary/30 bg-primary/5'
                )}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', meta.bg)}>
                  <Icon className={cn('h-4 w-4', meta.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    {actor && <Avatar className="h-4 w-4"><AvatarImage src={actor.avatarUrl} /><AvatarFallback className="text-[8px]">{actor.name[0]}</AvatarFallback></Avatar>}
                    <span className="text-[11px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                    {n.link && <Link href={n.link} className="text-[11px] text-primary hover:underline">View →</Link>}
                  </div>
                </div>
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100" title="Mark as read">
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
