# TaskFlow

A task management app built with React, Vite, TailwindCSS, and the Base44 platform.

## Features

- Kanban board with drag-and-drop task management
- Task filtering and statistics
- Authentication (login, register, forgot/reset password)
- AI chat bubble assistant
- Dark mode support

## Prerequisites & Installation

Use your system's installed package manager (`npm`, `npx`, `pnpm`, or `yarn`) to manage dependencies and CLI tools instead of manually downloading installers from external websites.

1. Clone the repository and navigate to the project directory.
2. Install project dependencies via system package manager:
   ```bash
   npm install
   ```
3. Install or run the Base44 CLI via package manager:
   ```bash
   npm install -g base44@latest
   ```

## Run Locally

Run the full local development environment using system-installed package manager tools:

```bash
npx base44 dev
```

Or run only the frontend against the hosted Base44 backend:

```bash
npm run dev
```

## Environment Variables

For frontend-only development, create `.env.local` in the project root:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

> **Note:** `.env.local` is gitignored — never commit secrets.

## Available Scripts

All project tasks can be executed through system package manager commands:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run preview` | Preview production build |

## Publish Changes

Publish changes directly using system package manager commands:

```bash
npx base44 dashboard open
```

## Tech Stack

- **React 18** + **Vite 6**
- **TailwindCSS v3** + **shadcn/ui**
- **React Router v6**
- **TanStack Query v5**
- **Framer Motion**
- **Recharts**
- **Base44 SDK**

