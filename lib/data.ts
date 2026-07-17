import type {
  User, Project, Sprint, Task, Repository, Contributor,
  Commit, Issue, PullRequest, AppNotification, Activity, Label, AISuggestion,
} from './types';

export const users: User[] = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex@devflow.ai', avatarUrl: 'https://i.pravatar.cc/120?img=12', role: 'owner', bio: 'Staff engineer. Building DevFlow AI.', githubUsername: 'alexrivera', joinedAt: '2024-09-01' },
  { id: 'u2', name: 'Priya Nair', email: 'priya@devflow.ai', avatarUrl: 'https://i.pravatar.cc/120?img=32', role: 'admin', bio: 'Backend & infra lead.', githubUsername: 'priyanair', joinedAt: '2024-09-04' },
  { id: 'u3', name: 'Marcus Lee', email: 'marcus@devflow.ai', avatarUrl: 'https://i.pravatar.cc/120?img=15', role: 'member', bio: 'Frontend engineer.', githubUsername: 'marcuslee', joinedAt: '2024-09-10' },
  { id: 'u4', name: 'Sofia Gomez', email: 'sofia@devflow.ai', avatarUrl: 'https://i.pravatar.cc/120?img=45', role: 'member', bio: 'Product designer & DX.', githubUsername: 'sofiagomez', joinedAt: '2024-09-12' },
  { id: 'u5', name: 'Kenji Watanabe', email: 'kenji@devflow.ai', avatarUrl: 'https://i.pravatar.cc/120?img=68', role: 'member', bio: 'ML & data engineer.', githubUsername: 'kenjiw', joinedAt: '2024-09-15' },
];

export const currentUser = users[0];

export const labels: Label[] = [
  { id: 'l1', name: 'bug', color: '#ef4444' },
  { id: 'l2', name: 'feature', color: '#3b82f6' },
  { id: 'l3', name: 'enhancement', color: '#8b5cf6' },
  { id: 'l4', name: 'docs', color: '#10b981' },
  { id: 'l5', name: 'performance', color: '#f59e0b' },
  { id: 'l6', name: 'security', color: '#ec4899' },
  { id: 'l7', name: 'ai', color: '#06b6d4' },
];

export const repositories: Repository[] = [
  {
    id: 'r1', name: 'devflow-web', fullName: 'devflow-ai/devflow-web',
    description: 'Next.js dashboard for DevFlow AI — project management meets GitHub.',
    language: 'TypeScript', stars: 1284, forks: 142, openIssues: 18, openPullRequests: 6,
    contributors: [
      { id: 'c1', name: 'alexrivera', avatarUrl: users[0].avatarUrl, commits: 412, additions: 18420, deletions: 6210 },
      { id: 'c2', name: 'marcuslee', avatarUrl: users[2].avatarUrl, commits: 318, additions: 14210, deletions: 3890 },
      { id: 'c3', name: 'sofiagomez', avatarUrl: users[3].avatarUrl, commits: 207, additions: 9840, deletions: 1240 },
      { id: 'c4', name: 'priyanair', avatarUrl: users[1].avatarUrl, commits: 156, additions: 7320, deletions: 2110 },
    ],
    connected: true, url: 'https://github.com/devflow-ai/devflow-web', updatedAt: '2025-01-14',
  },
  {
    id: 'r2', name: 'devflow-api', fullName: 'devflow-ai/devflow-api',
    description: 'FastAPI service powering summaries, bug prediction, and sprint planning.',
    language: 'Python', stars: 642, forks: 58, openIssues: 9, openPullRequests: 3,
    contributors: [
      { id: 'c5', name: 'priyanair', avatarUrl: users[1].avatarUrl, commits: 289, additions: 11240, deletions: 3120 },
      { id: 'c6', name: 'kenjiw', avatarUrl: users[4].avatarUrl, commits: 198, additions: 14210, deletions: 1820 },
      { id: 'c7', name: 'alexrivera', avatarUrl: users[0].avatarUrl, commits: 84, additions: 2210, deletions: 980 },
    ],
    connected: true, url: 'https://github.com/devflow-ai/devflow-api', updatedAt: '2025-01-13',
  },
  {
    id: 'r3', name: 'devflow-cli', fullName: 'devflow-ai/devflow-cli',
    description: 'Terminal-first companion for triaging issues and PRs from the command line.',
    language: 'Go', stars: 318, forks: 24, openIssues: 5, openPullRequests: 1,
    contributors: [
      { id: 'c8', name: 'kenjiw', avatarUrl: users[4].avatarUrl, commits: 142, additions: 6420, deletions: 980 },
      { id: 'c9', name: 'marcuslee', avatarUrl: users[2].avatarUrl, commits: 64, additions: 1820, deletions: 420 },
    ],
    connected: false, url: 'https://github.com/devflow-ai/devflow-cli', updatedAt: '2025-01-10',
  },
];

export const projects: Project[] = [
  { id: 'p1', name: 'DevFlow Web', key: 'DW', description: 'The dashboard experience for DevFlow AI.', color: '#3b82f6', progress: 72, memberIds: ['u1','u2','u3','u4'], repositoryId: 'r1', sprintIds: ['s1','s2'], createdAt: '2024-09-02' },
  { id: 'p2', name: 'DevFlow API', key: 'DA', description: 'AI services and REST API.', color: '#8b5cf6', progress: 58, memberIds: ['u1','u2','u5'], repositoryId: 'r2', sprintIds: ['s3'], createdAt: '2024-09-05' },
  { id: 'p3', name: 'DevFlow CLI', key: 'DC', description: 'Developer tooling for the terminal.', color: '#10b981', progress: 34, memberIds: ['u3','u5'], repositoryId: 'r3', sprintIds: [], createdAt: '2024-10-01' },
  { id: 'p4', name: 'Design System', key: 'DS', description: 'Shared component library and tokens.', color: '#f59e0b', progress: 88, memberIds: ['u3','u4'], repositoryId: null, sprintIds: [], createdAt: '2024-10-12' },
];

export const sprints: Sprint[] = [
  { id: 's1', name: 'Sprint 24 — Velocity', projectId: 'p1', goal: 'Ship Kanban board + AI summaries', startDate: '2025-01-06', endDate: '2025-01-20', status: 'active' },
  { id: 's2', name: 'Sprint 25 — Insights', projectId: 'p1', goal: 'Analytics suite + contribution graph', startDate: '2025-01-20', endDate: '2025-02-03', status: 'planned' },
  { id: 's3', name: 'Sprint 12 — Inference', projectId: 'p2', goal: 'Bug prediction model v2', startDate: '2025-01-06', endDate: '2025-01-20', status: 'active' },
];

export const tasks: Task[] = [
  { id: 't1', title: 'Implement drag-and-drop Kanban', description: 'Add HTML5 DnD to the board with optimistic status updates.', status: 'in-progress', priority: 'high', labels: ['l2'], assigneeId: 'u3', projectId: 'p1', dueDate: '2025-01-18', sprintId: 's1', comments: [{ id: 'cm1', authorId: 'u1', body: 'Let\'s use the native DnD API to avoid extra deps.', createdAt: '2025-01-10' }], createdAt: '2025-01-06', order: 0 },
  { id: 't2', title: 'AI issue summaries endpoint', description: 'Expose /ai/issue-summary that returns a 3-bullet digest.', status: 'review', priority: 'urgent', labels: ['l7','l2'], assigneeId: 'u5', projectId: 'p2', dueDate: '2025-01-16', sprintId: 's3', comments: [], createdAt: '2025-01-07', order: 0 },
  { id: 't3', title: 'Commit heatmap component', description: 'GitHub-style contribution heatmap using Recharts.', status: 'todo', priority: 'medium', labels: ['l2'], assigneeId: 'u3', projectId: 'p1', dueDate: '2025-01-22', sprintId: 's1', comments: [], createdAt: '2025-01-08', order: 0 },
  { id: 't4', title: 'Fix token refresh race condition', description: 'Multiple tabs can trigger refresh simultaneously.', status: 'backlog', priority: 'high', labels: ['l1','l6'], assigneeId: 'u2', projectId: 'p1', dueDate: null, sprintId: null, comments: [], createdAt: '2025-01-05', order: 0 },
  { id: 't5', title: 'Sprint planning assistant', description: 'Suggest sprint scope from backlog priority + velocity.', status: 'todo', priority: 'high', labels: ['l7','l2'], assigneeId: 'u5', projectId: 'p2', dueDate: '2025-01-24', sprintId: 's3', comments: [], createdAt: '2025-01-09', order: 1 },
  { id: 't6', title: 'Notification settings page', description: 'Per-channel toggles for mentions, reminders, due dates.', status: 'done', priority: 'medium', labels: ['l2'], assigneeId: 'u4', projectId: 'p1', dueDate: '2025-01-12', sprintId: 's1', comments: [{ id: 'cm2', authorId: 'u1', body: 'Looks great, shipping it.', createdAt: '2025-01-12' }], createdAt: '2025-01-04', order: 0 },
  { id: 't7', title: 'PR review suggestions', description: 'Inline AI comments on diff hunks with severity.', status: 'in-progress', priority: 'urgent', labels: ['l7'], assigneeId: 'u5', projectId: 'p2', dueDate: '2025-01-19', sprintId: 's3', comments: [], createdAt: '2025-01-08', order: 1 },
  { id: 't8', title: 'Repository import flow', description: 'Paginated repo picker with search and multi-select.', status: 'review', priority: 'high', labels: ['l2'], assigneeId: 'u3', projectId: 'p1', dueDate: '2025-01-17', sprintId: 's1', comments: [], createdAt: '2025-01-07', order: 1 },
  { id: 't9', title: 'Language distribution chart', description: 'Donut chart from repo language stats.', status: 'done', priority: 'low', labels: ['l2'], assigneeId: 'u4', projectId: 'p1', dueDate: '2025-01-11', sprintId: 's1', comments: [], createdAt: '2025-01-03', order: 1 },
  { id: 't10', title: 'Bug prediction model v2', description: 'Retrain on historical issue labels + churn features.', status: 'todo', priority: 'urgent', labels: ['l7','l1'], assigneeId: 'u5', projectId: 'p2', dueDate: '2025-01-26', sprintId: 's3', comments: [], createdAt: '2025-01-09', order: 2 },
  { id: 't11', title: 'Dark/light theme polish', description: 'Audit contrast ratios across all surfaces.', status: 'backlog', priority: 'low', labels: ['l4'], assigneeId: 'u4', projectId: 'p4', dueDate: null, sprintId: null, comments: [], createdAt: '2025-01-02', order: 1 },
  { id: 't12', title: 'CLI issue triage command', description: '`devflow triage` lists stale issues by risk.', status: 'in-progress', priority: 'medium', labels: ['l2'], assigneeId: 'u5', projectId: 'p3', dueDate: '2025-01-21', sprintId: null, comments: [], createdAt: '2025-01-06', order: 0 },
];

export const commits: Commit[] = [
  { id: 'cm1', sha: 'a1f3c9d', message: 'feat(board): optimistic task moves with rollback', authorId: 'u3', authorName: 'marcuslee', repositoryId: 'r1', additions: 184, deletions: 42, date: '2025-01-14T10:22:00Z' },
  { id: 'cm2', sha: 'b7e2ad1', message: 'fix(auth): serialize token refresh with mutex', authorId: 'u2', authorName: 'priyanair', repositoryId: 'r1', additions: 56, deletions: 31, date: '2025-01-14T09:14:00Z' },
  { id: 'cm3', sha: 'c0d44f8', message: 'feat(ai): streaming issue summaries', authorId: 'u5', authorName: 'kenjiw', repositoryId: 'r2', additions: 312, deletions: 88, date: '2025-01-13T18:02:00Z' },
  { id: 'cm4', sha: 'd9a11b2', message: 'refactor(charts): extract chart tooltip', authorId: 'u4', authorName: 'sofiagomez', repositoryId: 'r1', additions: 64, deletions: 120, date: '2025-01-13T14:48:00Z' },
  { id: 'cm5', sha: 'e5c7700', message: 'perf(api): cache contributor stats', authorId: 'u2', authorName: 'priyanair', repositoryId: 'r2', additions: 92, deletions: 14, date: '2025-01-12T16:30:00Z' },
  { id: 'cm6', sha: 'f2b8a44', message: 'docs: add sprint planning guide', authorId: 'u1', authorName: 'alexrivera', repositoryId: 'r1', additions: 210, deletions: 0, date: '2025-01-12T11:05:00Z' },
  { id: 'cm7', sha: 'a9102cd', message: 'feat(cli): triage command scaffold', authorId: 'u5', authorName: 'kenjiw', repositoryId: 'r3', additions: 142, deletions: 8, date: '2025-01-11T20:18:00Z' },
];

export const issues: Issue[] = [
  { id: 'i1', number: 142, title: 'Kanban card flickers on rapid drag', body: 'When dragging a card quickly between columns, a brief flicker appears...', state: 'open', repositoryId: 'r1', authorId: 'u3', assigneeId: 'u3', labels: ['l1'], createdAt: '2025-01-12', closedAt: null, aiSummary: 'Card flicker during fast drags likely caused by re-render before optimistic state settles. Suggest debouncing status writes and keying cards by id.' },
  { id: 'i2', number: 139, title: 'AI summaries occasionally truncate long issues', body: 'Issues over 8k tokens get cut off mid-sentence.', state: 'open', repositoryId: 'r2', authorId: 'u2', assigneeId: 'u5', labels: ['l7','l1'], createdAt: '2025-01-10', closedAt: null, aiSummary: 'Truncation at ~8k tokens indicates a context window cap. Recommend chunked summarization with map-reduce, then a final consolidation pass.' },
  { id: 'i3', number: 137, title: 'Add webhook for push events', body: 'We should ingest push events to keep commits fresh.', state: 'open', repositoryId: 'r1', authorId: 'u1', assigneeId: 'u2', labels: ['l2'], createdAt: '2025-01-09', closedAt: null, aiSummary: 'Feature request to ingest GitHub push webhooks. Scope: verify signature, dedupe by head SHA, enqueue commit sync job.' },
  { id: 'i4', number: 131, title: 'Theme toggle resets on reload', body: 'Theme preference not persisted.', state: 'closed', repositoryId: 'r1', authorId: 'u4', assigneeId: 'u4', labels: ['l1'], createdAt: '2025-01-05', closedAt: '2025-01-08', aiSummary: 'Resolved by persisting theme to localStorage and hydrating before paint to avoid FOUC.' },
];

export const pullRequests: PullRequest[] = [
  { id: 'pr1', number: 88, title: 'feat: optimistic Kanban with rollback', body: 'Implements HTML5 DnD with optimistic moves and server reconciliation.', state: 'open', repositoryId: 'r1', authorId: 'u3', reviewers: ['u1','u4'], additions: 412, deletions: 64, filesChanged: 9, createdAt: '2025-01-13', mergedAt: null, aiSummary: 'Adds optimistic drag-and-drop with rollback on failure. Risk: low. Suggest adding a Playwright test for the rollback path and a max-width to the drop placeholder.' },
  { id: 'pr2', number: 86, title: 'ai: streaming issue summaries', body: 'Streams summaries via SSE for snappy UX.', state: 'open', repositoryId: 'r2', authorId: 'u5', reviewers: ['u2'], additions: 318, deletions: 47, filesChanged: 6, createdAt: '2025-01-12', mergedAt: null, aiSummary: 'Introduces SSE streaming for summaries. Watch for unclosed connections on client disconnect; add a heartbeat interval and abort signal cleanup.' },
  { id: 'pr3', number: 84, title: 'charts: language distribution donut', body: 'Donut chart from repo language stats with legend.', state: 'merged', repositoryId: 'r1', authorId: 'u4', reviewers: ['u1'], additions: 142, deletions: 18, filesChanged: 3, createdAt: '2025-01-10', mergedAt: '2025-01-11', aiSummary: 'Clean addition. Center label could show total LOC; consider accessible labels for screen readers.' },
  { id: 'pr4', number: 82, title: 'auth: token refresh mutex', body: 'Serializes refresh across tabs.', state: 'open', repositoryId: 'r1', authorId: 'u2', reviewers: ['u1'], additions: 88, deletions: 22, filesChanged: 2, createdAt: '2025-01-11', mergedAt: null, aiSummary: 'Mutex approach is sound. Ensure the lock is released on tab close; a BroadcastChannel heartbeat would be more robust than a timeout.' },
];

export const notifications: AppNotification[] = [
  { id: 'n1', type: 'mention', title: 'Alex mentioned you', body: '@marcus can you take a look at the DnD rollback path in #88?', read: false, createdAt: '2025-01-14T11:30:00Z', actorId: 'u1', link: '/tasks' },
  { id: 'n2', type: 'pr', title: 'Review requested', body: 'Priya requested your review on PR #82', read: false, createdAt: '2025-01-14T09:15:00Z', actorId: 'u2', link: '/repositories' },
  { id: 'n3', type: 'due-date', title: 'Due in 2 days', body: 'AI issue summaries endpoint is due Jan 16.', read: false, createdAt: '2025-01-14T08:00:00Z', actorId: null, link: '/tasks' },
  { id: 'n4', type: 'review', title: 'AI review suggestion', body: 'Potential null-deref in commit heatmap render path.', read: true, createdAt: '2025-01-13T19:42:00Z', actorId: null, link: '/ai-assistant' },
  { id: 'n5', type: 'issue', title: 'New issue assigned', body: 'Issue #142 — Kanban card flickers on rapid drag', read: true, createdAt: '2025-01-12T12:10:00Z', actorId: 'u3', link: '/repositories' },
  { id: 'n6', type: 'reminder', title: 'Sprint ending soon', body: 'Sprint 24 — Velocity ends on Jan 20.', read: true, createdAt: '2025-01-12T07:00:00Z', actorId: null, link: '/projects' },
  { id: 'n7', type: 'system', title: 'Weekly digest ready', body: 'Your productivity score increased 12% this week.', read: true, createdAt: '2025-01-11T06:00:00Z', actorId: null, link: '/analytics' },
];

export const activities: Activity[] = [
  { id: 'a1', type: 'commit', title: 'pushed to devflow-web', description: 'feat(board): optimistic task moves with rollback', actorId: 'u3', projectId: 'p1', createdAt: '2025-01-14T10:22:00Z' },
  { id: 'a2', type: 'pr', title: 'opened pull request #88', description: 'feat: optimistic Kanban with rollback', actorId: 'u3', projectId: 'p1', createdAt: '2025-01-13T17:40:00Z' },
  { id: 'a3', type: 'task', title: 'moved task to Review', description: 'Repository import flow', actorId: 'u3', projectId: 'p1', createdAt: '2025-01-13T15:12:00Z' },
  { id: 'a4', type: 'issue', title: 'closed issue #131', description: 'Theme toggle resets on reload', actorId: 'u4', projectId: 'p1', createdAt: '2025-01-13T11:08:00Z' },
  { id: 'a5', type: 'comment', title: 'commented on task', description: 'Looks great, shipping it.', actorId: 'u1', projectId: 'p1', createdAt: '2025-01-12T16:30:00Z' },
  { id: 'a6', type: 'sprint', title: 'started sprint', description: 'Sprint 24 — Velocity', actorId: 'u1', projectId: 'p1', createdAt: '2025-01-06T09:00:00Z' },
];

export const aiSuggestions: AISuggestion[] = [
  { id: 'ai1', type: 'bug-prediction', title: 'High churn in auth/session.ts', body: 'Files touched in 5 of the last 7 bug fixes. Consider adding integration tests around token refresh; predicted defect probability 68%.', severity: 'critical', targetId: 'r1', createdAt: '2025-01-14T07:00:00Z' },
  { id: 'ai2', type: 'review', title: 'PR #88 — missing rollback test', body: 'The optimistic rollback path has no automated coverage. Add a Playwright test that simulates a failed move and asserts UI reverts.', severity: 'warning', targetId: 'pr1', createdAt: '2025-01-13T18:00:00Z' },
  { id: 'ai3', type: 'sprint', title: 'Sprint 25 scope suggestion', body: 'Based on velocity (34 pts) and backlog priority, recommend: Commit heatmap, Sprint planning assistant, Language distribution chart. Defer: CLI triage command.', severity: 'info', targetId: 's2', createdAt: '2025-01-13T06:00:00Z' },
  { id: 'ai4', type: 'summary', title: 'Issue #142 summary', body: 'Card flicker during fast drags. Root cause likely re-render before optimistic state settles. Suggested fix: debounce status writes and key cards by id.', severity: 'info', targetId: 'i1', createdAt: '2025-01-12T08:00:00Z' },
  { id: 'ai5', type: 'explanation', title: 'Commit a1f3c9d explained', body: 'Adds optimistic updates to the Kanban board: on drop, UI updates immediately and reconciles with the server; on failure, state rolls back and a toast surfaces.', severity: 'info', targetId: 'cm1', createdAt: '2025-01-14T10:30:00Z' },
];

// Derived helpers
export const weeklyActivity = [
  { day: 'Mon', commits: 12, prs: 2, issues: 4 },
  { day: 'Tue', commits: 18, prs: 3, issues: 2 },
  { day: 'Wed', commits: 9, prs: 1, issues: 6 },
  { day: 'Thu', commits: 22, prs: 4, issues: 3 },
  { day: 'Fri', commits: 15, prs: 2, issues: 5 },
  { day: 'Sat', commits: 4, prs: 0, issues: 1 },
  { day: 'Sun', commits: 6, prs: 1, issues: 2 },
];

export const productivityTrend = [
  { week: 'W1', score: 62 }, { week: 'W2', score: 68 }, { week: 'W3', score: 71 },
  { week: 'W4', score: 74 }, { week: 'W5', score: 79 }, { week: 'W6', score: 83 },
  { week: 'W7', score: 81 }, { week: 'W8', score: 88 },
];

export const languageDistribution = [
  { name: 'TypeScript', value: 48, color: '#3b82f6' },
  { name: 'Python', value: 27, color: '#10b981' },
  { name: 'Go', value: 12, color: '#06b6d4' },
  { name: 'CSS', value: 8, color: '#a855f7' },
  { name: 'Other', value: 5, color: '#f59e0b' },
];

export const prStats = [
  { name: 'Opened', value: 24 },
  { name: 'Merged', value: 18 },
  { name: 'Closed', value: 3 },
  { name: 'Draft', value: 5 },
];

export const issueResolution = [
  { week: 'W1', opened: 8, closed: 6 },
  { week: 'W2', opened: 10, closed: 9 },
  { week: 'W3', opened: 6, closed: 7 },
  { week: 'W4', opened: 9, closed: 8 },
  { week: 'W5', opened: 5, closed: 6 },
  { week: 'W6', opened: 7, closed: 9 },
];

export const teamContribution = [
  { user: 'Alex', commits: 412, reviews: 88 },
  { user: 'Priya', commits: 289, reviews: 64 },
  { user: 'Marcus', commits: 318, reviews: 41 },
  { user: 'Sofia', commits: 207, reviews: 22 },
  { user: 'Kenji', commits: 340, reviews: 35 },
];

// 53-week commit heatmap (7 rows x 53 cols)
export const commitHeatmap: number[][] = Array.from({ length: 7 }, (_, row) =>
  Array.from({ length: 53 }, (_, col) => {
    const seed = (row * 13 + col * 7) % 11;
    if (seed < 4) return 0;
    if (seed < 7) return 1;
    if (seed < 9) return 2;
    if (seed < 10) return 3;
    return 4;
  })
);

export function userById(id: string | null): User | undefined {
  if (!id) return undefined;
  return users.find((u) => u.id === id);
}

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function repoById(id: string | null): Repository | undefined {
  if (!id) return undefined;
  return repositories.find((r) => r.id === id);
}

export function labelById(id: string): Label | undefined {
  return labels.find((l) => l.id === id);
}
