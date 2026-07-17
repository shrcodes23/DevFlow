'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  User, Github, Bell, Palette, Sun, Moon, Check, Loader2,
  Link2, Unlink, Shield,
} from 'lucide-react';
import { PageHeader } from '@/components/shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/components/providers';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [githubConnected, setGithubConnected] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [notif, setNotif] = useState({ mentions: true, reminders: true, dueDates: true, prs: true, issues: true, weeklyDigest: false });

  const initials = user?.name?.split(' ').map((s) => s[0]).join('').slice(0, 2) ?? 'DF';

  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  const toggleGithub = () => {
    setConnecting(true);
    setTimeout(() => { setGithubConnected((v) => !v); setConnecting(false); }, 700);
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your profile, GitHub connection, theme, and notifications." />

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile"><User className="mr-1.5 h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="github"><Github className="mr-1.5 h-4 w-4" /> GitHub</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-1.5 h-4 w-4" /> Appearance</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1.5 h-4 w-4" /> Notifications</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <div className="max-w-2xl space-y-6 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-border">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">Change avatar</Button>
                <p className="mt-1.5 text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={user?.role}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="github-username">GitHub username</Label>
                <Input id="github-username" defaultValue={user?.githubUsername ?? ''} placeholder="Not connected" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" defaultValue={user?.bio} rows={3} />
            </div>

            <div className="flex justify-end">
              <Button onClick={save} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Save changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* GitHub */}
        <TabsContent value="github">
          <div className="max-w-2xl space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">GitHub Account</p>
                    {githubConnected ? (
                      <p className="text-xs text-muted-foreground">Connected as <span className="text-primary">@{user?.githubUsername ?? 'alexrivera'}</span></p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not connected</p>
                    )}
                  </div>
                </div>
                {githubConnected ? (
                  <Badge variant="secondary" className="gap-1"><Check className="h-3 w-3 text-success" /> Connected</Badge>
                ) : null}
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant={githubConnected ? 'outline' : 'default'} onClick={toggleGithub} disabled={connecting}>
                  {connecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : githubConnected ? <Unlink className="mr-2 h-4 w-4" /> : <Link2 className="mr-2 h-4 w-4" />}
                  {githubConnected ? 'Disconnect' : 'Connect GitHub'}
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold">Repository Access</h3>
              <p className="mt-1 text-xs text-muted-foreground">DevFlow AI can access these repositories.</p>
              <div className="mt-4 space-y-2">
                {['devflow-ai/devflow-web', 'devflow-ai/devflow-api', 'devflow-ai/devflow-cli'].map((r) => (
                  <div key={r} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                    <span className="font-mono text-xs">{r}</span>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-5">
              <Shield className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground">DevFlow AI requests read access to repositories, issues, pull requests, and commit metadata. We never store your source code.</p>
            </div>
          </div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <div className="max-w-2xl space-y-6 rounded-xl border border-border bg-card p-6">
            <div>
              <h3 className="text-sm font-semibold">Theme</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Choose your preferred color scheme.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    'relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all',
                    theme === t ? 'border-primary bg-primary/5' : 'border-border hover:border-border/70'
                  )}
                >
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', t === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100')}>
                    {t === 'dark' ? <Moon className="h-6 w-6 text-zinc-100" /> : <Sun className="h-6 w-6 text-zinc-700" />}
                  </div>
                  <span className="text-sm font-medium capitalize">{t}</span>
                  {theme === t && <Check className="absolute right-3 top-3 h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">Theme preference is saved locally and applied before paint to avoid flash of unstyled content.</p>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="max-w-2xl space-y-3 rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold">Notification Channels</h3>
            <p className="text-xs text-muted-foreground">Choose which alerts you want to receive.</p>
            <div className="mt-2 divide-y divide-border">
              {[
                { key: 'mentions' as const, label: 'Mentions', desc: 'When someone @mentions you' },
                { key: 'reminders' as const, label: 'Task reminders', desc: 'Reminders for upcoming work' },
                { key: 'dueDates' as const, label: 'Due date alerts', desc: 'Alerts before tasks are due' },
                { key: 'prs' as const, label: 'Pull request updates', desc: 'PR opened, merged, or reviewed' },
                { key: 'issues' as const, label: 'Issue updates', desc: 'Issues assigned or closed' },
                { key: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'Summary of your week every Monday' },
              ].map((row) => (
                <div key={row.key} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{row.label}</p>
                    <p className="text-xs text-muted-foreground">{row.desc}</p>
                  </div>
                  <Switch checked={notif[row.key]} onCheckedChange={(v) => setNotif((p) => ({ ...p, [row.key]: v }))} />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={save} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Save preferences
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
