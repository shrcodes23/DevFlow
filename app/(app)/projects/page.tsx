'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, GitBranch, Users, Plus, ArrowUpRight, CalendarDays, Target } from 'lucide-react';
import { PageHeader, CardSkeleton } from '@/components/shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { userById, repoById, sprints as sprintData } from '@/lib/data';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => { api.projects.list().then(setProjects); }, []);

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Track progress across your engineering initiatives."
        action={<Button><Plus className="mr-2 h-4 w-4" /> New Project</Button>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {!projects
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} className="h-56" />)
          : projects.map((p, i) => {
              const repo = repoById(p.repositoryId);
              const activeSprint = sprintData.find((s) => s.projectId === p.id && s.status === 'active');
              return (
                <div key={p.id} className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-border/70 hover:shadow-lg hover:shadow-black/20 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}99)` }}>
                        {p.key}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">{p.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="font-medium">{p.progress}%</span></div>
                    <Progress value={p.progress} className="mt-1.5 h-1.5" />
                  </div>

                  {activeSprint && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs">
                      <Target className="h-3.5 w-3.5 text-primary" />
                      <span className="text-muted-foreground">Active:</span>
                      <span className="font-medium">{activeSprint.name}</span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {repo ? (
                      <Badge variant="secondary" className="gap-1 text-[11px]"><GitBranch className="h-3 w-3" /> {repo.name}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[11px]">No repo</Badge>
                    )}
                    <Badge variant="outline" className="gap-1 text-[11px]"><CalendarDays className="h-3 w-3" /> {p.sprintIds.length} sprints</Badge>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex -space-x-2">
                      {p.memberIds.slice(0, 4).map((id) => {
                        const u = userById(id);
                        return (
                          <Avatar key={id} className="h-7 w-7 ring-2 ring-card">
                            <AvatarImage src={u?.avatarUrl} alt={u?.name} />
                            <AvatarFallback className="text-[10px]">{u?.name?.[0]}</AvatarFallback>
                          </Avatar>
                        );
                      })}
                      {p.memberIds.length > 4 && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium ring-2 ring-card">+{p.memberIds.length - 4}</div>
                      )}
                    </div>
                    <Button asChild variant="ghost" size="sm" className="opacity-0 transition-opacity group-hover:opacity-100">
                      <Link href="/tasks">Open <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
