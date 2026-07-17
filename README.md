# DevFlow AI

**AI-Powered GitHub Project Management for developers and software teams.**

DevFlow AI brings project management, GitHub integration, and AI-powered insights together in a single premium dashboard. Plan sprints, triage issues, review pull requests, and predict bugs — all in one place.

---

## Features

### Authentication
- Login & Register pages with JWT-based mock auth
- User profile with role-based access control (Owner / Admin / Member)
- Persistent sessions via localStorage

### Dashboard
- Total Projects, Active Tasks, Pending PRs, Open Issues, Productivity Score
- Weekly Activity graph (commits, PRs, issues)
- Productivity score trend chart
- Recent activity feed with live actor avatars
- Active sprint progress and AI insight highlights

### GitHub Integration
- Connect / disconnect GitHub account
- Import repositories with search and filter
- Browse synced issues, pull requests, and commits
- Contributor avatars and repository statistics (stars, forks, open counts)

### AI Features
- **AI Assistant chat** — ask about issues, PRs, commits, sprints, and risks
- AI-generated **issue summaries** (3-bullet digest)
- AI-generated **pull request summaries** with risk assessment
- AI **commit explanations** in plain language
- AI **code review suggestions** with severity levels
- AI **bug prediction** — flags high-churn files by predicted defect probability
- AI **sprint planning assistant** — recommends scope from velocity and backlog

### Project Management
- **Kanban board** with 5 columns (Backlog → To Do → In Progress → Review → Done)
- **Drag and drop** tasks with optimistic UI updates and rollback on failure
- Sprint management with goals, dates, and status
- Labels, priorities (low → urgent), due dates, assignees
- Task detail dialog with comments and AI summary generation

### Analytics
- **Commit heatmap** (GitHub-style 53-week contribution grid)
- Weekly productivity chart (bar)
- Language distribution (donut)
- Issue resolution rate (area chart, opened vs closed)
- Pull request statistics (horizontal bar)
- Team contribution graph (commits & reviews per member)
- Productivity trend (line chart)

### Notifications
- Real-time notification feed with type icons (mention, reminder, due date, PR, issue, review, system)
- Unread / all filter toggle
- Mark individual or all as read (optimistic)
- Linked navigation to relevant pages

### Settings
- Profile editing (name, email, role, bio, GitHub username, avatar)
- GitHub connection management with per-repository access toggles
- Theme switcher (dark / light) with no-FOUC hydration
- Per-channel notification preferences

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Next.js 13 (App Router) |
| Styling | Tailwind CSS, shadcn/ui, CSS variables |
| Charts | Recharts |
| Icons | Lucide React |
| Auth | Mock JWT (client-side, localStorage) |
| Data | Mock API layer with simulated latency & dummy data |
| Backend (documented) | FastAPI, PostgreSQL, SQLAlchemy, JWT — see [Backend API](#backend-api-reference) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to the login page.

**Demo credentials:**
- Email: `alex@devflow.ai`
- Password: `demo1234`

(Any email/password works — the mock API auto-logs you in.)

### Build

```bash
npm run build
npm start
```

---

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout (fonts, providers)
│   ├── page.tsx                 # Root redirect (auth gate)
│   ├── globals.css             # Theme tokens, animations, utilities
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Register page
│   └── (app)/                  # Authenticated route group
│       ├── layout.tsx          # AppShell wrapper (auth guard)
│       ├── dashboard/
│       ├── projects/
│       ├── repositories/
│       ├── tasks/
│       ├── ai-assistant/
│       ├── analytics/
│       ├── notifications/
│       └── settings/
├── components/
│   ├── app-shell.tsx           # Sidebar + top navbar
│   ├── providers.tsx           # Theme + Auth context providers
│   ├── shared.tsx              # StatCard, PageHeader, skeletons, EmptyState
│   └── ui/                     # shadcn/ui primitives
├── lib/
│   ├── types.ts                # TypeScript domain types
│   ├── data.ts                 # Dummy data (users, projects, tasks, repos, etc.)
│   └── api.ts                  # Mock API layer (simulated latency)
├── tailwind.config.ts
└── next.config.js
```

---

## Design System

- **Theme:** Premium dark (Linear / Vercel / GitHub inspired) with optional light mode
- **Palette:** 6 color ramps (primary, success, warning, info, destructive, chart) + neutral tones
- **Typography:** Inter (sans) + JetBrains Mono (mono), 3 weights max
- **Spacing:** 8px base grid
- **Corners:** `0.75rem` default radius
- **Animations:** Fade-in, scale-in, shimmer skeletons, pulse-glow, float
- **Glassmorphism:** Backdrop-blur navbar and cards
- **Responsive:** Mobile sidebar drawer, breakpoints at sm / md / lg / xl

---

## Backend API Reference

The frontend uses a mock API layer (`lib/api.ts`) with simulated network latency. The production backend is designed as a FastAPI service with PostgreSQL and SQLAlchemy. Below is the reference API spec.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account, returns JWT |
| POST | `/api/auth/login` | Authenticate, returns JWT |
| GET | `/api/auth/me` | Current user profile |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects |
| GET | `/api/projects/{id}` | Project detail |
| POST | `/api/projects` | Create project |
| PATCH | `/api/projects/{id}` | Update project |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (filter by project, sprint, status) |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/{id}` | Update task (status, assignee, etc.) |
| DELETE | `/api/tasks/{id}` | Delete task |

### Repositories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/repositories` | List connected repos |
| POST | `/api/repositories/connect` | Connect GitHub account (OAuth callback) |
| POST | `/api/repositories/{id}/import` | Import a repository |
| GET | `/api/repositories/{id}/commits` | Fetch commits |
| GET | `/api/repositories/{id}/issues` | Pull open issues |
| GET | `/api/repositories/{id}/pulls` | Pull pull requests |
| GET | `/api/repositories/{id}/contributors` | Contributors + stats |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/issue-summary` | Generate issue summary |
| POST | `/api/ai/pr-summary` | Generate PR summary |
| POST | `/api/ai/commit-explain` | Explain a commit |
| POST | `/api/ai/code-review` | Code review suggestions |
| GET | `/api/ai/bug-prediction` | Bug risk predictions |
| POST | `/api/ai/sprint-plan` | Sprint planning assistant |
| GET | `/api/ai/insights` | All AI suggestions |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/weekly` | Weekly activity data |
| GET | `/api/analytics/productivity` | Productivity trend |
| GET | `/api/analytics/languages` | Language distribution |
| GET | `/api/analytics/pr-stats` | PR statistics |
| GET | `/api/analytics/issue-resolution` | Issue resolution rate |
| GET | `/api/analytics/team-contribution` | Team contribution |
| GET | `/api/analytics/heatmap` | Commit heatmap data |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications |
| PATCH | `/api/notifications/{id}` | Mark as read |
| POST | `/api/notifications/mark-all-read` | Mark all as read |

---

## License

MIT
