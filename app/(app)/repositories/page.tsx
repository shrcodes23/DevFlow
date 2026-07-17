'use client';

import { useEffect, useState } from 'react';
import {
  GitBranch, Star, GitFork, CircleDot, GitPullRequest, Users,
  Plus, Loader2, CheckCircle2, Search, Sparkles,
} from 'lucide-react';
import { PageHeader, CardSkeleton } from '@/components/shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import type { Repository, Issue, PullRequest, Commit } from '@/lib/types';
import { userById } from '@/lib/data';

const langColor: Record<string, string> = {
  TypeScript: '#3b82f6', Python: '#10b981', Go: '#06b6d4', Rust: '#f59e0b',
};

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repository[] | null>(null);
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [prs, setPrs] = useState<PullRequest[] | null>(null);
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.repositories.list().then(setRepos);
    api.issues.list().then(setIssues);
    api.pullRequests.list().then(setPrs);
    api.commits.list().then(setCommits);
  }, []);

  const connect = async (id: string) => {
    setConnecting(id);
    await api.repositories.connect(id);
    setRepos((prev) => prev?.map((r) => r.id === id ? { ...r, connected: true } : r) ?? null);
    setConnecting(null);
  };

  const filtered = repos?.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.fullName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Repositories"
        description="Connect GitHub and import repositories to sync issues, PRs, and commits."
        action={<Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Import Repository</Button>}
      />

      {/* Connection banner */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-gradient-to-r from-primary/10 via-transparent to-chart-4/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">GitHub connected as <span className="text-primary">@alexrivera</span></p>
            <p className="text-xs text-muted-foreground">{repos?.filter(r => r.connected).length ?? 0} of {repos?.length ?? 0} repositories linked</p>
          </div>
        </div>
        <Button variant="secondary" size="sm"><CheckCircle2 className="mr-2 h-4 w-4 text-success" /> Connected</Button>
      </div>

      <Tabs defaultValue="repos">
        <TabsList className="mb-4">
          <TabsTrigger value="repos">Repositories</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="prs">Pull Requests</TabsTrigger>
          <TabsTrigger value="commits">Commits</TabsTrigger>
        </TabsList>

        <TabsContent value="repos" className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Filter repositories…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>

          {!filtered ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} className="h-44" />)}</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filtered.map((r, i) => (
                <div key={r.id} className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-border/70 hover:shadow-lg animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold">{r.fullName}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{r.description}</p>
                      </div>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: langColor[r.language] ?? '#888' }} title={r.language} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {r.stars.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><GitFork className="h-3.5 w-3.5" /> {r.forks}</span>
                    <span className="flex items-center gap-1"><CircleDot className="h-3.5 w-3.5" /> {r.openIssues} issues</span>
                    <span className="flex items-center gap-1"><GitPullRequest className="h-3.5 w-3.5" /> {r.openPullRequests} PRs</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {r.contributors.slice(0, 5).map((c) => (
                        <Avatar key={c.id} className="h-6 w-6 ring-2 ring-card">
                          <AvatarImage src={c.avatarUrl} alt={c.name} />
                          <AvatarFallback className="text-[9px]">{c.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[9px] ring-2 ring-card"><Users className="h-3 w-3" /></div>
                    </div>
                    {r.connected ? (
                      <Badge variant="secondary" className="gap-1 text-[11px]"><CheckCircle2 className="h-3 w-3 text-success" /> Linked</Badge>
                    ) : (
                      <Button size="sm" variant="outline" disabled={connecting === r.id} onClick={() => connect(r.id)}>
                        {connecting === r.id ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Plus className="mr-1.5 h-3.5 w-3.5" />}
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="issues" className="space-y-2">
          {!issues ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} className="h-16" />) : issues.map((issue, i) => {
            const author = userById(issue.authorId);
            return (
              <div key={issue.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/40 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <CircleDot className={`h-4 w-4 ${issue.state === 'open' ? 'text-warning' : 'text-success'}`} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{issue.title}</p>
                  <p className="text-xs text-muted-foreground">#{issue.number} · {issue.state} · {issue.labels.join(', ')}</p>
                </div>
                {issue.aiSummary && (
                  <Badge variant="secondary" className="gap-1 text-[11px]"><Sparkles className="h-3 w-3 text-primary" /> AI</Badge>
                )}
                <Avatar className="h-6 w-6"><AvatarImage src={author?.avatarUrl} /><AvatarFallback className="text-[9px]">{author?.name?.[0]}</AvatarFallback></Avatar>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="prs" className="space-y-2">
          {!prs ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} className="h-16" />) : prs.map((pr, i) => {
            const author = userById(pr.authorId);
            const stateColor = pr.state === 'merged' ? 'text-chart-4' : pr.state === 'open' ? 'text-warning' : 'text-destructive';
            return (
              <div key={pr.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/40 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <GitPullRequest className={`h-4 w-4 ${stateColor}`} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{pr.title}</p>
                  <p className="text-xs text-muted-foreground">#{pr.number} · +{pr.additions} −{pr.deletions} · {pr.filesChanged} files · {pr.reviewers.length} reviewers</p>
                </div>
                {pr.aiSummary && <Badge variant="secondary" className="gap-1 text-[11px]"><Sparkles className="h-3 w-3 text-primary" /> AI</Badge>}
                <Avatar className="h-6 w-6"><AvatarImage src={author?.avatarUrl} /><AvatarFallback className="text-[9px]">{author?.name?.[0]}</AvatarFallback></Avatar>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="commits" className="space-y-2">
          {!commits ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} className="h-14" />) : commits.map((c, i) => {
            const author = userById(c.authorId);
            return (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/40 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-primary">{c.sha}</code>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm">{c.message}</p>
                  <p className="text-xs text-muted-foreground">+{c.additions} −{c.deletions}</p>
                </div>
                <Avatar className="h-6 w-6"><AvatarImage src={author?.avatarUrl} /><AvatarFallback className="text-[9px]">{author?.name?.[0]}</AvatarFallback></Avatar>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
