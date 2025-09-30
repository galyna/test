# Task Management Application

A full-featured task management application built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: View summary statistics and recent activity
- **Task List**: Browse, filter, search, and sort all tasks
- **Create Task**: Add new tasks with validation
- **Task Details**: View, edit, and delete tasks with history tracking
- **User Management**: Manage users with role assignments

## Prerequisites

- Node.js 18.x or higher
- npm or yarn

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/galyna/test.git
   cd test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: In-memory storage (client-side)

## Application Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── tasks/
│   │   ├── page.tsx       # Task List
│   │   ├── create/
│   │   │   └── page.tsx   # Create Task
│   │   └── [id]/
│   │       └── page.tsx   # Task Detail
│   └── users/
│       └── page.tsx       # User Management
├── components/
│   └── Navigation.tsx     # Navigation component
└── lib/
    ├── types.ts          # TypeScript types
    └── store.ts          # In-memory data store
```

## Sample Data

The application comes pre-loaded with:
- 4 users (John Developer, Sarah Designer, Mike QA, Lisa Manager)
- 8 tasks with various statuses and priorities

## Features Overview

### Dashboard
- Total tasks count
- Completed tasks count
- In-progress tasks count
- Last 5 recent activities

### Task List
- Search functionality (min 3 characters)
- Filter by status (All, To Do, In Progress, Done)
- Sortable by Created Date and Priority
- Click row to view details

### Create Task
- Form validation
- Character limits (Title: 100, Description: 500)
- Due date validation (no past dates)
- Auto-generated task IDs

### Task Detail
- View mode with all task information
- Edit mode with validation
- Delete with confirmation
- Task history tracking
- Status change tracking

### User Management
- Add new users with validation
- Inline editing
- Delete protection (users with tasks can't be deleted)
- Task count per user
- Email validation

## Data Persistence

Note: This application uses in-memory storage. All data will be reset when the application restarts. For production use, integrate with a database (e.g., PostgreSQL, MongoDB).

## License

MIT