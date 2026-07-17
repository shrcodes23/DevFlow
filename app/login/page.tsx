'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Github, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('alex@devflow.ai');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(email, password); router.push('/dashboard'); }
    catch { setError('Invalid credentials.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-grid p-12 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-chart-4/10" />
        <div className="relative flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">DevFlow AI</span>
        </div>
        <div className="relative space-y-4">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            AI-powered project management<br />built for developers.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Summarize issues, predict bugs, and plan sprints — all wired to your GitHub repositories.
          </p>
        </div>
        <div className="relative text-xs text-muted-foreground">© 2025 DevFlow AI</div>
      </div>

      {/* Right form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm animate-fade-in">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">DevFlow AI</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your workspace to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot?</button>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase text-muted-foreground"><span className="bg-background px-2">or</span></div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => login('alex@devflow.ai', 'demo1234').then(() => router.push('/dashboard'))}>
            <Github className="mr-2 h-4 w-4" /> Continue with GitHub
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Don&apos;t have an account? <Link href="/register" className="font-medium text-primary hover:underline">Create one</Link>
          </p>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Demo: alex@devflow.ai / demo1234</p>
        </div>
      </div>
    </div>
  );
}
