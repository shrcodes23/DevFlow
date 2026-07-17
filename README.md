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

