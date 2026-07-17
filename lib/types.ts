export type Role = 'owner' | 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  bio: string;
  githubUsername: string | null;
  joinedAt: string;
}

export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  labels: string[];
  assigneeId: string | null;
  projectId: string;
  dueDate: string | null;
  sprintId: string | null;
  comments: TaskComment[];
  createdAt: string;
  order: number;
}

export interface TaskComment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  color: string;
  progress: number;
  memberIds: string[];
  repositoryId: string | null;
  sprintIds: string[];
  createdAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  openPullRequests: number;
  contributors: Contributor[];
  connected: boolean;
  url: string;
  updatedAt: string;
}

export interface Contributor {
  id: string;
  name: string;
  avatarUrl: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface Commit {
  id: string;
  sha: string;
  message: string;
  authorId: string;
  authorName: string;
  repositoryId: string;
  additions: number;
  deletions: number;
  date: string;
}

export interface Issue {
  id: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  repositoryId: string;
  authorId: string;
  assigneeId: string | null;
  labels: string[];
  createdAt: string;
  closedAt: string | null;
  aiSummary?: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'merged' | 'closed';
  repositoryId: string;
  authorId: string;
  reviewers: string[];
  additions: number;
  deletions: number;
  filesChanged: number;
  createdAt: string;
  mergedAt: string | null;
  aiSummary?: string;
}

export type NotificationType = 'mention' | 'reminder' | 'due-date' | 'pr' | 'issue' | 'review' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actorId: string | null;
  link?: string;
}

export interface Activity {
  id: string;
  type: 'commit' | 'pr' | 'issue' | 'task' | 'comment' | 'sprint';
  title: string;
  description: string;
  actorId: string;
  projectId: string | null;
  createdAt: string;
}

export interface AISuggestion {
  id: string;
  type: 'summary' | 'review' | 'bug-prediction' | 'sprint' | 'explanation';
  title: string;
  body: string;
  severity?: 'info' | 'warning' | 'critical';
  targetId: string;
  createdAt: string;
}
