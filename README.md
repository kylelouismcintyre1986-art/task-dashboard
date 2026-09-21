# FermentationLab Pro

A production operations workspace for fermentation and distillation teams, with the original task dashboard retained under **Operations**.

> **Note:** This application is intended for demonstration purposes only and is not meant for production use.

## Features

- **Production dashboard**: facility health, yield forecast, revenue forecast, live alerts, and production overview
- **Batch manager**: fermentation, distillation, and aging stages with gravity, temperature, and yield data
- **Recipe builder**: ingredient bills, recipe versioning, batch estimates, AI confidence, and export actions
- **Distillation tracker**: heads/hearts/tails collection, proof tracking, and cut recommendations
- **AI copilot**: production questions and actionable recommendations
- **Supabase foundation**: environment-aware client, password authentication flow, data access helper, and PostgreSQL/RLS migration

- **Task Management**: Create, complete, and delete tasks
- **Task Tags**: Organize tasks with customizable tags
- **Task Lists**: Create multiple lists with custom filters
- **List Filters**: Filter tasks by tags or completion status
- **Animations**: Smooth transitions and animations using Framer Motion
- **Responsive Design**: Works on desktop and mobile devices
- **Windows desktop app**: Electron wrapper with secure renderer isolation and NSIS installer packaging

## Supabase setup

The app runs with local demo data when Supabase is not configured. To connect a project:

1. Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Install the Supabase CLI, link the project, and run `supabase db push` to apply `supabase/migrations/20260921000000_initial_schema.sql`.
3. Enable email/password authentication in Supabase Auth. The app exposes the sign-in flow when both environment variables are present.

PDF generation, QR/NFC scanning, push notifications, and live hardware sensor ingestion are intentionally integration points in this web slice. They require a storage bucket, camera/native capabilities, notification provider, and sensor gateway respectively.

## Technology Stack

- **React**: Modern React with functional components and hooks
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for React
- **Vite**: Fast, modern build tool and development server
- **Vitest**: Testing framework compatible with Vite

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v10+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-dashboard.git
   cd task-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app

### Run as a Windows desktop app

Install dependencies, then run the Electron development wrapper:

```bash
npm install
npm run desktop
```

The desktop development command starts Vite on port 3000 and opens the renderer in an Electron window. For a production Windows installer:

```bash
npm run build:desktop
```

The NSIS installer is written to `dist-electron/` by `electron-builder`. The packaged app loads the local Vite build from `dist/`; it does not require a development server.

### Available Scripts

- `npm start` - Start the development server
- `npm start:hydrated` - Start the development server with data hydration enabled
- `npm run build` - Build for production
- `npm run build:hydrated` - Build for production with data hydration enabled
- `npm run build:clean` - Build for production with data hydration explicitly disabled
- `npm run preview` - Preview the production build locally
- `npm run preview:hydrated` - Preview the production build with data hydration enabled
- `npm test` - Run tests with Vitest
- `npm run desktop` - Run the app in Electron against the Vite development server
- `npm run build:desktop` - Build the renderer and package a Windows NSIS installer

### Data Hydration

The application supports pre-populating the app with sample data through an optional hydration process:

- Sample data is defined in `src/data/initialData.json`
- Hydration can be enabled/disabled using the `VITE_ENABLE_DATA_HYDRATION` environment variable
- Use the convenience scripts for development with hydration:
  - `npm run start:hydrated` - Development with sample data
  - `npm run build:hydrated` - Production build with sample data
  - `npm run build:clean` - Production build without sample data
- GitHub Actions deployment automatically enables hydration for the production build

## Architecture

### State Management

The application uses React Context for state management:

- **TaskContext**: Manages tasks state and operations (add, toggle, delete)
- **TagContext**: Manages tags and their relationships with tasks
- **ListContext**: Manages task lists and filtering logic

### UI Components

The application features several key components:
- **TaskList**: Renders a list of tasks
- **TaskItem**: Renders an individual task
- **TaskBoard**: Manages multiple task lists
- **TagManager**: Interface for creating and managing tags
- **GlobalTaskForm**: Form for creating new tasks
- **ListAddTask**: Form for adding tasks to specific lists
- **TaskListConfig**: Interface for configuring task lists

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
