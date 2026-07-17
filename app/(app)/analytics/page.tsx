'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';
import { TrendingUp, GitCommit, GitPullRequest, CircleDot, Users } from 'lucide-react';
import { PageHeader, StatCard, CardSkeleton } from '@/components/shared';
import { api } from '@/lib/api';
import {
  weeklyActivity, productivityTrend, languageDistribution,
  prStats, issueResolution, teamContribution, commitHeatmap,
} from '@/lib/data';

const heatColors = ['hsl(var(--muted))', 'hsl(var(--chart-1) / 0.3)', 'hsl(var(--chart-1) / 0.55)', 'hsl(var(--chart-1) / 0.8)', 'hsl(var(--chart-1))'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([api.analytics.weekly(), api.analytics.productivity()]).then(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Analytics" description="Deep insights into your team's engineering performance." />

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Avg. PRs / week" value="14" delta="+22%" icon={GitPullRequest} accent="primary" />
        <StatCard label="Issue Resolution" value="86%" delta="+8%" icon={CircleDot} accent="success" />
        <StatCard label="Total Commits" value="1,247" delta="+156" icon={GitCommit} accent="info" />
        <StatCard label="Review Coverage" value="92%" delta="+4%" icon={Users} accent="warning" />
      </div>

      {/* Commit heatmap */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Commit Heatmap</h3>
            <p className="text-xs text-muted-foreground">1,247 contributions in the last year</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            Less
            {heatColors.map((c, i) => <span key={i} className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />)}
            More
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <div className="inline-flex flex-col gap-1">
            {commitHeatmap.map((row, ri) => (
              <div key={ri} className="flex gap-1">
                {row.map((val, ci) => (
                  <div
                    key={ci}
                    className="h-3 w-3 rounded-sm transition-colors hover:ring-1 hover:ring-primary"
                    style={{ background: heatColors[val] }}
                    title={`${val * 3} commits`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between pl-6 text-[10px] text-muted-foreground">
            {months.map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Weekly productivity */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-semibold">Weekly Productivity</h3>
          <p className="mb-4 text-xs text-muted-foreground">Commits, PRs, and issues per day</p>
          {loading ? <CardSkeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} cursor={{ fill: 'hsl(var(--muted) / 0.4)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Bar dataKey="commits" fill="hsl(var(--chart-1))" radius={[4,4,0,0]} />
                <Bar dataKey="prs" fill="hsl(var(--chart-4))" radius={[4,4,0,0]} />
                <Bar dataKey="issues" fill="hsl(var(--chart-3))" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Language distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-semibold">Language Distribution</h3>
          <p className="mb-4 text-xs text-muted-foreground">Across all connected repositories</p>
          {loading ? <CardSkeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={languageDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} stroke="none">
                  {languageDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Issue resolution rate */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-semibold">Issue Resolution Rate</h3>
          <p className="mb-4 text-xs text-muted-foreground">Opened vs closed over 6 weeks</p>
          {loading ? <CardSkeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={issueResolution}>
                <defs>
                  <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0} /></linearGradient>
                  <linearGradient id="closeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Area type="monotone" dataKey="opened" stroke="hsl(var(--chart-3))" strokeWidth={2} fill="url(#openGrad)" />
                <Area type="monotone" dataKey="closed" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#closeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PR statistics */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-semibold">Pull Request Statistics</h3>
          <p className="mb-4 text-xs text-muted-foreground">Lifecycle distribution this month</p>
          {loading ? <CardSkeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={prStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} cursor={{ fill: 'hsl(var(--muted) / 0.4)' }} />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Team contribution + productivity trend */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-semibold">Team Contribution</h3>
          <p className="mb-4 text-xs text-muted-foreground">Commits and reviews per member</p>
          {loading ? <CardSkeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={teamContribution} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="user" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} cursor={{ fill: 'hsl(var(--muted) / 0.4)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Bar dataKey="commits" fill="hsl(var(--chart-1))" radius={[4,4,0,0]} />
                <Bar dataKey="reviews" fill="hsl(var(--chart-4))" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-semibold">Productivity Trend</h3>
          <p className="mb-4 text-xs text-muted-foreground">8-week score trajectory</p>
          {loading ? <CardSkeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={productivityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--chart-2))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--chart-2))', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
