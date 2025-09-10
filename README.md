# TanStack Supabase Starter

A modern, full-stack starter template built with cutting-edge technologies for rapid development and production-ready applications.

## ✨ Features

- **⭐ [React 19](https://react.dev)** - Latest React with concurrent features
- **🏝️ [TanStack Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest)** - Full-stack React framework with type-safe routing
- **🎨 [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)** - Utility-first CSS framework with beautiful components
- **🔐 [Supabase](https://supabase.com/)** - Authentication and Database with SSR

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### 1. Clone and Install

```bash
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run the migration in your Supabase SQL editor:

```bash
# Copy and paste the contents of supabase/migrations/001_create_posts_table.sql
# into your Supabase SQL editor and execute it
```

The migration creates:

- `posts` table with user authentication
- Row Level Security (RLS) policies for data isolation
- Performance indexes for optimal queries

### 4. Generate Types (Optional)

```bash
pnpm supabase gen types typescript --project-id "your-project-id" --schema public > database.types.ts
```

### 5. Start Development

```bash
pnpm dev
```

Visit `http://localhost:3000` and start building! 🎉

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
