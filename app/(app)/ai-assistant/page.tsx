'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Sparkles, Bug, GitPullRequest, GitCommit, CalendarRange, FileText,
  Loader2, Send, AlertTriangle, Info, AlertCircle, Lightbulb,
} from 'lucide-react';
import { PageHeader, CardSkeleton } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import type { AISuggestion } from '@/lib/types';
import { cn } from '@/lib/utils';

const typeMeta = {
  'bug-prediction': { icon: Bug, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Bug Prediction' },
  'review': { icon: GitPullRequest, color: 'text-warning', bg: 'bg-warning/10', label: 'Code Review' },
  'sprint': { icon: CalendarRange, color: 'text-primary', bg: 'bg-primary/10', label: 'Sprint Planning' },
  'summary': { icon: FileText, color: 'text-info', bg: 'bg-info/10', label: 'Issue Summary' },
  'explanation': { icon: GitCommit, color: 'text-chart-4', bg: 'bg-chart-4/10', label: 'Commit Explanation' },
} as const;

const severityMeta: Record<string, { icon: React.ElementType; color: string }> = {
  info: { icon: Info, color: 'text-info' },
  warning: { icon: AlertTriangle, color: 'text-warning' },
  critical: { icon: AlertCircle, color: 'text-destructive' },
};

interface ChatMsg { role: 'user' | 'assistant'; content: string; }

const quickPrompts = [
  'Summarize the riskiest open PRs',
  'Which files are likely to have bugs?',
  'Plan the next sprint based on velocity',
  'Explain the latest commit on devflow-web',
];

export default function AIAssistantPage() {
  const [suggestions, setSuggestions] = useState<AISuggestion[] | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: 'Hi! I\'m your DevFlow AI assistant. I can summarize issues, review PRs, predict bugs, and help plan sprints. What would you like to do?' },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { api.ai.suggestions().then(setSuggestions); }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, thinking]);

  const send = async (text?: string) => {
    const prompt = text ?? input;
    if (!prompt.trim()) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: prompt }]);
    setThinking(true);
    // Simulated AI response
    await new Promise((r) => setTimeout(r, 900));
    const lower = prompt.toLowerCase();
    let response = '';
    if (lower.includes('bug') || lower.includes('risk')) {
      response = 'Based on churn analysis, `auth/session.ts` has a 68% predicted defect probability — it appears in 5 of the last 7 bug fixes. I recommend adding integration tests around token refresh and reviewing the mutex implementation in PR #82.';
    } else if (lower.includes('sprint')) {
      response = 'Your team velocity is 34 points/week. For Sprint 25, I recommend: Commit heatmap (8pts), Sprint planning assistant (5pts), Language distribution chart (3pts). Defer the CLI triage command to Sprint 26 to avoid overcommitting.';
    } else if (lower.includes('pr') || lower.includes('pull')) {
      response = 'PR #88 (optimistic Kanban) is the riskiest open PR — it lacks automated tests for the rollback path. PR #82 (token refresh mutex) needs a review for lock-release-on-tab-close. PR #86 (streaming summaries) looks clean but watch for unclosed SSE connections.';
    } else if (lower.includes('commit')) {
      response = 'The latest commit on devflow-web is `a1f3c9d` — "feat(board): optimistic task moves with rollback". It adds optimistic UI updates to the Kanban board: on drop, the UI updates immediately and reconciles with the server; on failure, state rolls back and a toast surfaces. +184 −42 lines across 4 files.';
    } else {
      response = 'I can help with issue summaries, PR reviews, commit explanations, bug predictions, and sprint planning. Try one of the quick prompts below, or ask me about a specific issue or PR.';
    }
    setThinking(false);
    setMessages((m) => [...m, { role: 'assistant', content: response }]);
  };

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Summaries, code review, bug prediction, and sprint planning — powered by AI."
        action={<Badge variant="secondary" className="gap-1"><Sparkles className="h-3 w-3 text-primary" /> 1,580 credits left</Badge>}
      />

      <Tabs defaultValue="chat">
        <TabsList className="mb-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Chat */}
            <div className="lg:col-span-2 flex flex-col rounded-xl border border-border bg-card" style={{ height: 'calc(100vh - 280px)', minHeight: 480 }}>
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-5">
                {messages.map((m, i) => (
                  <div key={i} className={cn('flex gap-3 animate-fade-in', m.role === 'user' && 'flex-row-reverse')}>
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', m.role === 'assistant' ? 'bg-gradient-to-br from-primary to-chart-4' : 'bg-muted')}>
                      {m.role === 'assistant' ? <Sparkles className="h-4 w-4 text-primary-foreground" /> : <span className="text-xs font-semibold">You</span>}
                    </div>
                    <div className={cn('max-w-[80%] rounded-xl px-4 py-2.5 text-sm', m.role === 'assistant' ? 'bg-muted/50' : 'bg-primary text-primary-foreground')}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-4"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
                    <div className="flex items-center gap-1 rounded-xl bg-muted/50 px-4 py-3">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border p-4">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {quickPrompts.map((p) => (
                    <button key={p} onClick={() => send(p)} className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder="Ask about issues, PRs, commits, sprints…"
                    className="min-h-[44px] resize-none"
                    rows={1}
                  />
                  <Button size="icon" onClick={() => send()} disabled={thinking || !input.trim()}>
                    {thinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Capabilities sidebar */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Lightbulb className="h-4 w-4 text-warning" /> Capabilities</h3>
                <div className="space-y-2.5">
                  {Object.entries(typeMeta).map(([key, m]) => {
                    const Icon = m.icon;
                    return (
                      <div key={key} className="flex items-center gap-2.5 text-xs">
                        <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', m.bg)}><Icon className={cn('h-3.5 w-3.5', m.color)} /></div>
                        <span>{m.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-chart-4/10 p-5">
                <p className="text-xs text-muted-foreground">Tip: Mention an issue number (e.g. <span className="font-medium text-foreground">#142</span>) or PR title to get a targeted summary.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-3">
          {!suggestions ? (
            Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} className="h-24" />)
          ) : suggestions.map((s, i) => {
            const meta = typeMeta[s.type];
            const sev = s.severity ? severityMeta[s.severity] : null;
            const Icon = meta.icon;
            return (
              <div key={s.id} className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start gap-3">
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', meta.bg)}><Icon className={cn('h-5 w-5', meta.color)} /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{s.title}</h3>
                      <Badge variant="outline" className="text-[10px]">{meta.label}</Badge>
                    {sev && (() => { const SevIcon = sev.icon; return <span className={cn('flex items-center gap-1 text-[11px]', sev.color)}><SevIcon className="h-3 w-3" /> {s.severity}</span>; })()}
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
