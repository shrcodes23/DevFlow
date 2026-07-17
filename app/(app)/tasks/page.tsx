'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Plus, Calendar, MessageSquare, Flag, Sparkles, Loader2, X,
} from 'lucide-react';
import { PageHeader, CardSkeleton } from '@/components/shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { userById, labelById, projectById } from '@/lib/data';
import type { Task, TaskStatus, Priority } from '@/lib/types';
import { cn } from '@/lib/utils';

const columns: { key: TaskStatus; label: string; accent: string }[] = [
  { key: 'backlog', label: 'Backlog', accent: 'bg-muted-foreground' },
  { key: 'todo', label: 'To Do', accent: 'bg-info' },
  { key: 'in-progress', label: 'In Progress', accent: 'bg-primary' },
  { key: 'review', label: 'Review', accent: 'bg-warning' },
  { key: 'done', label: 'Done', accent: 'bg-success' },
];

const priorityColor: Record<Priority, string> = {
  low: 'text-muted-foreground', medium: 'text-info',
  high: 'text-warning', urgent: 'text-destructive',
};

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 8.64e7);
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);
  const [selected, setSelected] = useState<Task | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => { api.tasks.list().then(setTasks); }, []);

  const onDrop = useCallback(async (status: TaskStatus) => {
    if (!dragId) return;
    const task = tasks?.find((t) => t.id === dragId);
    if (!task || task.status === status) { setDragId(null); setDragOver(null); return; }
    // Optimistic update
    setTasks((prev) => prev?.map((t) => t.id === dragId ? { ...t, status } : t) ?? null);
    setDragId(null); setDragOver(null);
    try { await api.tasks.updateStatus(dragId, status); }
    catch {
      // Rollback on failure
      setTasks((prev) => prev?.map((t) => t.id === task.id ? { ...t, status: task.status } : t) ?? null);
    }
  }, [dragId, tasks]);

  const getAiSummary = async (task: Task) => {
    setAiLoading(true);
    const res = await api.ai.summarizeIssue(task.id);
    setSelected((prev) => prev && res.id === prev.id ? { ...prev, comments: [...prev.comments, { id: 'ai-' + Date.now(), authorId: 'u5', body: 'AI: ' + res.summary, createdAt: new Date().toISOString() }] } : prev);
    setAiLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Drag cards across columns. Changes save optimistically."
        action={<Button><Plus className="mr-2 h-4 w-4" /> New Task</Button>}
      />

      {!tasks ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} className="h-64" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key).sort((a, b) => a.order - b.order);
            return (
              <div
                key={col.key}
                className={cn(
                  'flex flex-col rounded-xl border bg-card/50 transition-colors',
                  dragOver === col.key ? 'border-primary bg-primary/5' : 'border-border'
                )}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col.key); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => onDrop(col.key)}
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', col.accent)} />
                    <span className="text-sm font-medium">{col.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{colTasks.length}</span>
                </div>
                <div className="flex-1 space-y-2 p-3 min-h-[120px]">
                  {colTasks.map((t, i) => {
                    const assignee = userById(t.assigneeId);
                    const due = t.dueDate ? daysUntil(t.dueDate) : null;
                    return (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={() => setDragId(t.id)}
                        onDragEnd={() => { setDragId(null); setDragOver(null); }}
                        onClick={() => setSelected(t)}
                        className={cn(
                          'group cursor-grab rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-md active:cursor-grabbing animate-fade-in',
                          dragId === t.id && 'opacity-40'
                        )}
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug">{t.title}</p>
                          <Flag className={cn('h-3.5 w-3.5 shrink-0', priorityColor[t.priority])} />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {t.labels.map((lid) => {
                            const l = labelById(lid);
                            return l ? <span key={lid} className="rounded px-1.5 py-0.5 text-[10px] font-medium" style={{ background: l.color + '22', color: l.color }}>{l.name}</span> : null;
                          })}
                        </div>
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            {due !== null && (
                              <span className={cn('flex items-center gap-1', due < 0 ? 'text-destructive' : due <= 2 ? 'text-warning' : '')}>
                                <Calendar className="h-3 w-3" /> {due < 0 ? `${Math.abs(due)}d overdue` : `${due}d`}
                              </span>
                            )}
                            {t.comments.length > 0 && <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {t.comments.length}</span>}
                          </div>
                          {assignee && (
                            <Avatar className="h-6 w-6"><AvatarImage src={assignee.avatarUrl} /><AvatarFallback className="text-[9px]">{assignee.name[0]}</AvatarFallback></Avatar>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {colTasks.length === 0 && (
                    <p className="py-8 text-center text-xs text-muted-foreground">Drop tasks here</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">{projectById(selected.projectId)?.key}-{selected.id.slice(-3).toUpperCase()}</span>
                  {selected.labels.map((lid) => {
                    const l = labelById(lid);
                    return l ? <span key={lid} className="rounded px-1.5 py-0.5 text-[10px] font-medium" style={{ background: l.color + '22', color: l.color }}>{l.name}</span> : null;
                  })}
                </div>
                <DialogTitle className="text-lg">{selected.title}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Assignee</Label>
                  <div className="mt-1 flex items-center gap-2">
                    {(() => { const u = userById(selected.assigneeId); return u ? <><Avatar className="h-6 w-6"><AvatarImage src={u.avatarUrl} /><AvatarFallback className="text-[9px]">{u.name[0]}</AvatarFallback></Avatar><span className="text-xs">{u.name}</span></> : <span className="text-xs text-muted-foreground">Unassigned</span>; })()}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Priority</Label>
                  <p className={cn('mt-1 text-xs font-medium capitalize', priorityColor[selected.priority])}>{selected.priority}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Due date</Label>
                  <p className="mt-1 text-xs">{selected.dueDate ?? 'None'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge variant="secondary" className="mt-1 capitalize">{selected.status.replace('-', ' ')}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Comments</Label>
                  <Button size="sm" variant="ghost" onClick={() => getAiSummary(selected)} disabled={aiLoading}>
                    {aiLoading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />}
                    AI Summary
                  </Button>
                </div>
                <div className="max-h-40 space-y-2 overflow-y-auto scrollbar-thin">
                  {selected.comments.map((c) => {
                    const author = userById(c.authorId);
                    return (
                      <div key={c.id} className="flex gap-2 rounded-lg bg-muted/50 p-2.5">
                        <Avatar className="h-6 w-6 shrink-0"><AvatarImage src={author?.avatarUrl} /><AvatarFallback className="text-[9px]">{author?.name?.[0]}</AvatarFallback></Avatar>
                        <div><p className="text-xs font-medium">{author?.name}</p><p className="text-xs text-muted-foreground">{c.body}</p></div>
                      </div>
                    );
                  })}
                  {selected.comments.length === 0 && <p className="text-xs text-muted-foreground">No comments yet.</p>}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
