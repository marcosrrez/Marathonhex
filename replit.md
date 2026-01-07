# Marathon Training Tracker

## Overview

A 16-week marathon training tracker application with a premium athletic design inspired by Nike Run Club and Strava. The app allows users to view their training plan, track workout completions, log detailed workout metrics, and monitor their overall progress toward race day.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with custom design tokens, shadcn/ui component library
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite with hot module replacement

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/` (shadcn/ui)
- Feature-specific components in `client/src/components/`
- Shared utilities and hooks in `client/src/lib/` and `client/src/hooks/`

### Backend Architecture

- **Framework**: Express.js with TypeScript
- **Server**: Node.js with HTTP server supporting both API and static file serving
- **API Design**: RESTful endpoints under `/api/` prefix
- **Development**: Vite middleware integration for hot reloading

The backend serves dual purposes:
1. API endpoints for workout completion CRUD operations
2. Static file serving for the production build

### Data Layer

- **ORM**: Drizzle ORM with Zod integration for schema validation
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` contains all type definitions and validation schemas
- **Storage Abstraction**: `server/storage.ts` provides an interface layer, currently using in-memory storage with database-ready patterns

The training plan data is hardcoded in `client/src/lib/training-data.ts` as it represents static content (the 16-week training schedule).

### Shared Code

The `shared/` directory contains TypeScript types and Zod schemas used by both frontend and backend:
- Workout types and categories
- Completion status enums
- Validation schemas for API requests

### Design System

The application uses a custom design system defined in:
- `client/src/index.css` - CSS custom properties for theming (light/dark mode)
- `tailwind.config.ts` - Extended Tailwind configuration
- `design_guidelines.md` - Nike-inspired design principles

Key design features:
- Dark/light theme support with system preference detection
- Premium athletic aesthetic with bold typography
- Hexagon-based workout visualization components

## External Dependencies

### UI Components
- **shadcn/ui**: Complete Radix UI component library (`@radix-ui/*` packages)
- **Framer Motion**: Animation library for React
- **Lucide React**: Icon library

### Data & Forms
- **TanStack React Query**: Async state management
- **React Hook Form** with Zod resolvers: Form handling and validation
- **date-fns**: Date manipulation utilities

### Database
- **Drizzle ORM**: TypeScript-first ORM
- **PostgreSQL**: Primary database (via `pg` driver)
- **connect-pg-simple**: Session storage for PostgreSQL

### Build & Development
- **Vite**: Frontend build tool
- **esbuild**: Server bundling
- **TypeScript**: Type checking across the stack