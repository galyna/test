# Task Management Application

A full-featured, mobile-first task management application built with Next.js, React, TypeScript, and Tailwind CSS. Features a Trello-style Kanban board with drag & drop, task dependencies, and beautiful responsive design.

## ✨ Key Features

### 📊 **Dashboard**
- Real-time summary statistics (total, completed, in-progress tasks)
- Last 5 recent activities with timestamps
- Quick access to create new tasks
- Fully responsive mobile layout

### 📋 **Kanban Board (Trello-Style)**
- Drag & drop task cards between columns (To Do, In Progress, Done)
- Visual blocked task indicators with red ring
- Dependency count badges on cards
- Touch-optimized for mobile devices
- Auto-saves status changes

### 📝 **Task List**
- Advanced search (min 3 characters)
- Filter by status with 4 options
- Sortable by Created Date and Priority
- Desktop: Full table view
- Mobile: Card-based layout
- Click to view details

### ➕ **Create Task**
- Form validation with real-time feedback
- Character limits (Title: 100, Description: 500)
- Priority selection (Low, Medium, High)
- Assignee dropdown
- Due date validation (no past dates)
- Auto-generated unique task IDs

### 🔍 **Task Details**
- View/Edit mode toggle
- Delete with confirmation dialog
- Complete task history timeline
- Status change tracking
- **Task Dependencies**: Add/remove blockers with circular dependency prevention
- Visual indicators for blocked tasks

### 🔗 **Task Dependencies**
- Link tasks as blockers/dependencies
- Circular dependency prevention
- Visual indicators:
  - 🔴 Red ring on blocked tasks (Kanban)
  - 🚫 Blocked banner with blocker count
  - 🔗 Dependency icon with count
  - ⚠️ Warning when task is blocked by incomplete tasks
- Click-through navigation between dependencies
- "Blocked By" and "Blocking" sections

### 👥 **User Management**
- Add new users with email validation
- Inline table editing
- Delete protection (can't delete users with assigned tasks)
- Task count per user
- Role-based organization (Developer, Designer, QA, Manager)

### 📱 **Mobile-First Design**
- Responsive breakpoints (mobile, tablet, desktop)
- Hamburger menu with smooth dropdown
- Touch-optimized tap targets
- Card layouts for mobile
- Sticky navigation header
- Full-width buttons on small screens
- Optimized spacing and font sizes

### 🌙 **Dark Mode**
- Toggle button in navigation (sun/moon icon)
- Persists preference in localStorage
- Respects system preference
- Smooth transitions between themes
- Optimized colors for readability in both modes
- All components fully dark mode compatible

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

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **State Management**: In-memory storage (client-side)
- **Responsive Design**: Mobile-first approach with breakpoints

## 📁 Application Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard (📊 stats & recent activity)
│   ├── kanban/
│   │   └── page.tsx       # Kanban Board (🎯 drag & drop)
│   ├── tasks/
│   │   ├── page.tsx       # Task List (📝 filter & search)
│   │   ├── create/
│   │   │   └── page.tsx   # Create Task (➕ form validation)
│   │   └── [id]/
│   │       └── page.tsx   # Task Detail (🔍 edit, delete, dependencies)
│   ├── users/
│   │   └── page.tsx       # User Management (👥 CRUD operations)
│   ├── layout.tsx         # Root layout with navigation
│   └── globals.css        # Global styles & dark text fix
├── components/
│   └── Navigation.tsx     # Responsive nav with mobile menu
└── lib/
    ├── types.ts          # TypeScript interfaces (Task, User, etc.)
    └── store.ts          # In-memory data store & dependency logic
```

## 📊 Sample Data

The application comes pre-loaded with:
- **4 Users**: John Developer, Sarah Designer, Mike QA, Lisa Manager
- **8 Tasks**: Various statuses and priorities across different projects

## 🎯 How to Use

### Navigation
- **Desktop**: Click navigation links in the header
- **Tablet**: Icon-based navigation for space efficiency  
- **Mobile**: Hamburger menu with dropdown

### Managing Tasks
1. **Dashboard** - Overview of all tasks and recent activity
2. **Kanban Board** - Drag tasks between columns to update status
3. **Task List** - Search, filter, and sort tasks; click to view details
4. **Create Task** - Fill form with validation feedback
5. **Task Details** - Edit, delete, add dependencies, view history

### Task Dependencies
1. Open any task detail page
2. Scroll to "Task Dependencies" section
3. Click "+ Add Blocker" to create dependency
4. Select blocker task from dropdown
5. System prevents circular dependencies automatically
6. View blocked tasks highlighted on Kanban board

### Mobile Usage
- **Touch & Drag**: Drag tasks on Kanban board with touch
- **Tap Targets**: Larger buttons for easy tapping
- **Card Layout**: Mobile-friendly task cards instead of tables
- **Swipe Navigation**: Smooth menu transitions

### Dark Mode
1. Click the sun/moon icon in the navigation bar
2. Theme preference is saved automatically
3. System preference is respected on first visit
4. Smooth transitions between light and dark modes

## 💾 Data Persistence

**Note**: This application uses in-memory storage. All data will be reset when the application restarts. 

For production use, integrate with a database:
- PostgreSQL / MySQL for relational data
- MongoDB for document storage
- Prisma ORM recommended for type-safe queries

## 🎨 Design Features

### Visual Indicators
- **Priority Colors**: Red (High), Yellow (Medium), Green (Low)
- **Status Badges**: Color-coded status pills
- **Blocked Tasks**: Red ring indicator on Kanban cards
- **Dependency Count**: Orange icon with number badge

### Responsive Breakpoints
- **Mobile**: < 640px (single column, hamburger menu)
- **Tablet**: 640px - 768px (icon nav, 2-column grid)
- **Desktop**: > 768px (full nav, 3-column Kanban)

### User Experience
- **Smooth Transitions**: All theme and state changes animate smoothly
- **Hover States**: Interactive elements have clear hover feedback
- **Loading States**: Error handling for edge cases
- **Confirmation Dialogs**: Destructive actions require confirmation
- **Dark Mode**: Toggle between light and dark themes with one click
- **Persistent Preferences**: Theme choice saved in localStorage

## 🚀 Future Enhancements

Potential features to add:
- [ ] Real-time collaboration with WebSockets
- [ ] File attachments on tasks
- [ ] Comments and mentions
- [ ] Email notifications
- [ ] Task templates
- [ ] Sprint planning
- [ ] Gantt chart view
- [ ] Time tracking
- [ ] Custom fields
- [x] ~~Dark mode theme~~ ✅ Implemented!

## 📝 License

MIT

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [dnd-kit](https://dndkit.com/) - Drag and drop
- [TypeScript](https://www.typescriptlang.org/) - Type safety