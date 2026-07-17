import {
  users, projects, sprints, tasks, repositories, commits, issues,
  pullRequests, notifications, activities, aiSuggestions,
  currentUser, weeklyActivity, productivityTrend, languageDistribution,
  prStats, issueResolution, teamContribution, commitHeatmap,
} from './data';
import type {
  User, Project, Sprint, Task, Repository, Commit, Issue, PullRequest,
  AppNotification, Activity, AISuggestion, TaskStatus,
} from './types';

const latency = <T>(value: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

export const api = {
  auth: {
    async login(email: string, _password: string): Promise<{ user: User; token: string }> {
      const user = users.find((u) => u.email === email) ?? currentUser;
      return latency({ user, token: 'mock-jwt-' + user.id });
    },
    async register(name: string, email: string): Promise<{ user: User; token: string }> {
      const user: User = {
        id: 'u' + (users.length + 1),
        name, email, avatarUrl: 'https://i.pravatar.cc/120?u=' + encodeURIComponent(email),
        role: 'member', bio: 'New to DevFlow AI.', githubUsername: null, joinedAt: new Date().toISOString().slice(0, 10),
      };
      return latency({ user, token: 'mock-jwt-' + user.id });
    },
    async me(): Promise<User> { return latency(currentUser, 100); },
  },

  projects: {
    async list(): Promise<Project[]> { return latency(projects); },
    async get(id: string): Promise<Project | undefined> { return latency(projects.find((p) => p.id === id)); },
  },

  sprints: {
    async list(): Promise<Sprint[]> { return latency(sprints); },
  },

  tasks: {
    async list(): Promise<Task[]> { return latency(tasks); },
    async updateStatus(id: string, status: TaskStatus): Promise<{ id: string; status: TaskStatus }> {
      return latency({ id, status }, 250);
    },
  },

  repositories: {
    async list(): Promise<Repository[]> { return latency(repositories); },
    async connect(id: string): Promise<{ id: string; connected: boolean }> {
      return latency({ id, connected: true }, 500);
    },
    async import(name: string): Promise<{ name: string; imported: boolean }> {
      return latency({ name, imported: true }, 500);
    },
  },

  commits: { async list(): Promise<Commit[]> { return latency(commits); } },
  issues: { async list(): Promise<Issue[]> { return latency(issues); } },
  pullRequests: { async list(): Promise<PullRequest[]> { return latency(pullRequests); } },

  notifications: {
    async list(): Promise<AppNotification[]> { return latency(notifications); },
    async markRead(id: string): Promise<{ id: string; read: boolean }> { return latency({ id, read: true }, 150); },
    async markAllRead(): Promise<{ ok: boolean }> { return latency({ ok: true }, 200); },
  },

  activity: { async feed(): Promise<Activity[]> { return latency(activities, 250); } },

  ai: {
    async suggestions(): Promise<AISuggestion[]> { return latency(aiSuggestions, 450); },
    async summarizeIssue(id: string): Promise<{ id: string; summary: string }> {
      const issue = issues.find((i) => i.id === id);
      return latency({ id, summary: issue?.aiSummary ?? 'No summary available.' }, 700);
    },
    async explainCommit(sha: string): Promise<{ sha: string; explanation: string }> {
      const c = commits.find((c) => c.sha === sha);
      return latency({ sha, explanation: c?.message + ' — AI explanation: this change improves reliability and adds test coverage.' }, 700);
    },
    async sprintPlan(): Promise<{ plan: string }> {
      return latency({ plan: aiSuggestions.find((a) => a.type === 'sprint')?.body ?? 'Plan ready.' }, 800);
    },
  },

  analytics: {
    async weekly() { return latency(weeklyActivity, 200); },
    async productivity() { return latency(productivityTrend, 200); },
    async languages() { return latency(languageDistribution, 200); },
    async prStats() { return latency(prStats, 200); },
    async issueResolution() { return latency(issueResolution, 200); },
    async teamContribution() { return latency(teamContribution, 200); },
    async heatmap() { return latency(commitHeatmap, 200); },
  },

  users: { async list(): Promise<User[]> { return latency(users, 100); } },
};
