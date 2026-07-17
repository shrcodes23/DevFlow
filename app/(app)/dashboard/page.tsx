'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  FolderKanban, ListTodo, GitPullRequest, CircleDot, TrendingUp,
  GitCommit, MessageSquare, CheckCircle2, PlayCircle, Sparkles, ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader, StatCard, CardSkeleton, ChartSkeleton } from '@/components/shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { userById } from '@/lib/data';
import type { Activity } from '@/lib/types';
import { weeklyActivity, productivityTrend } from '@/lib/data';

const activityIcon = {
  commit: GitCommit, pr: GitPullRequest, issue: CircleDot,
  task: ListTodo, comment: MessageSquare, sprint: PlayCircle,
} as const;

const activityColor = {
  commit: 'text-info', pr: 'text-chart-4', issue: 'text-warning',
  task: 'text-primary', comment: 'text-muted-foreground', sprint: 'text-success',
} as const;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3.6e6);
  if (h < 1) return Math.max(1, Math.floor(diff / 6e4)) + 'm ago';
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

export default function DashboardPage() {
  const [activity, setActivity] = useState<Activity[] | null>(null);

  useEffect(() => { api.activity.feed().then(setActivity); }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your engineering pulse at a glance."
        action={
          <Button asChild>
            <Link href="/ai-assistant"><Sparkles className="mr-2 h-4 w-4" /> Ask AI</Link>
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Projects" value={4} delta="+1" icon={FolderKanban} accent="primary" footer="this quarter" />
        <StatCard label="Active Tasks" value={12} delta="+3" icon={ListTodo} accent="info" footer="in progress" />
        <StatCard label="Pending PRs" value={6} delta="+2" icon={GitPullRequest} accent="warning" footer="awaiting review" />
        <StatCard label="Open Issues" value={18} delta="-4" icon={CircleDot} accent="destructive" footer="3 critical" />
        <StatCard label="Productivity" value="88" delta="+12%" icon={TrendingUp} accent="success" footer="vs last week" />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Weekly Activity</h3>
              <p className="text-xs text-muted-foreground">Commits, pull requests, and issues</p>
            </div>
            <Badge variant="secondary" className="text-[11px]">Last 7 days</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyActivity} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
                cursor={{ fill: 'hsl(var(--muted) / 0.4)' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
              <Bar dataKey="commits" fill="hsl(var(--chart-1))" radius={[4,4,0,0]} />
              <Bar dataKey="prs" fill="hsl(var(--chart-4))" radius={[4,4,0,0]} />
              <Bar dataKey="issues" fill="hsl(var(--chart-3))" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Productivity Score</h3>
            <p className="text-xs text-muted-foreground">8-week trend</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={productivityTrend}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[50, 100]} />
              <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#prodGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity feed + quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent Activity</h3>
            <Link href="/analytics" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {!activity ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} className="h-14" />)}</div>
          ) : (
            <div className="space-y-1">
              {activity.map((a, i) => {
                const Icon = activityIcon[a.type];
                const actor = userById(a.actorId);
                return (
                  <div key={a.id} className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent/50 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted ${activityColor[a.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{actor?.name}</span>{' '}
                        <span className="text-muted-foreground">{a.title}</span>
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{a.description}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(a.createdAt)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-chart-4/10 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">AI Insights</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Bug prediction flagged <span className="font-medium text-foreground">auth/session.ts</span> as high-risk (68%).</p>
            <Button asChild variant="secondary" size="sm" className="mt-3 w-full">
              <Link href="/ai-assistant">Review suggestions <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Active Sprint</h3>
            <p className="mt-1 text-xs text-muted-foreground">Sprint 24 — Velocity</p>
            <div className="mt-3 space-y-2">
              {[
                { label: 'Done', value: 3, color: 'bg-success', total: 8 },
                { label: 'In Progress', value: 3, color: 'bg-primary', total: 8 },
                { label: 'To Do', value: 2, color: 'bg-warning', total: 8 },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">{r.label}</span><span>{r.value}/{r.total}</span></div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${r.color}`} style={{ width: `${(r.value / r.total) * 100}%` }} /></div>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link href="/tasks">Open board <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
