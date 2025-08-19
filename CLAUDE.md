# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Dyad is a local, open-source AI app builder built with Electron, React, and TypeScript. It provides functionality similar to Lovable, v0, or Bolt, but runs entirely on the user's machine with local-first privacy and control.

## Common Development Commands

### Build and Run

- `npm start` - Start the Electron app in development mode
- `npm run package` - Build the app for the current platform
- `npm run make` - Create distributable packages

### Testing

- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run pre:e2e` - Build the app for E2E testing
- `npm run e2e` - Run the E2E test suite
- `npm run e2e e2e-tests/<filename>.spec.ts` - Run a specific E2E test

### Code Quality

- `npm run lint` - Run oxlint for linting
- `npm run lint:fix` - Fix linting issues automatically
- `npm run prettier` - Format code with Prettier
- `npm run prettier:check` - Check formatting without fixing
- `npm run ts` - Type-check all TypeScript files (main + workers)
- `npm run presubmit` - Run linting and formatting checks before committing

### Database

- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Apply migrations to database
- `npm run db:studio` - Open Drizzle Studio for database inspection

## High-Level Architecture

### Process Architecture

Dyad follows Electron's multi-process architecture:

1. **Main Process** (`src/main.ts`)

   - Manages application lifecycle, window creation, and system-level operations
   - Handles IPC communication with renderer process
   - Manages file system operations, git operations, and external process spawning
   - Runs database operations using SQLite via better-sqlite3

2. **Renderer Process** (`src/renderer.tsx`)

   - React application using TanStack Router for navigation
   - Uses Jotai for global state management
   - Communicates with main process via IPC client pattern

3. **Preload Script** (`src/preload.ts`)
   - Bridges renderer and main processes securely
   - Exposes limited IPC methods to renderer via contextBridge

### IPC Communication Pattern

The codebase follows a strict IPC pattern for security:

1. **IPC Client** (`src/ipc/ipc_client.ts`)

   - Singleton in renderer process
   - Provides typed methods for all IPC channels
   - Returns promises that resolve/reject based on main process response

2. **IPC Handlers** (`src/ipc/handlers/`)

   - Registered in main process via `ipc_host.ts`
   - Each handler file manages a specific domain (apps, chat, settings, etc.)
   - Handlers **must throw Error objects** on failure (not return error objects)

3. **React Hooks Integration**
   - Custom hooks use TanStack Query for data fetching/mutations
   - Pattern: Hook → IpcClient → Main Process Handler → Database/FileSystem
   - Errors propagate through promise rejections to TanStack Query error handling

### Key Directories

- `/src/app/` - Application-level components (layout, title bar)
- `/src/atoms/` - Jotai atoms for global state
- `/src/components/` - React components organized by feature
- `/src/hooks/` - Custom React hooks for data fetching and mutations
- `/src/ipc/` - IPC communication layer
  - `/handlers/` - Main process IPC handlers
  - `/processors/` - Response processors for AI operations
  - `/utils/` - Shared utilities for IPC operations
- `/src/pages/` - Page components for routing
- `/src/prompts/` - AI system prompts
- `/scaffold/` - Template for new React apps created by Dyad
- `/e2e-tests/` - Playwright E2E tests

### Data Layer

1. **Database** (SQLite via Drizzle ORM)

   - Schema defined in `src/db/schema.ts`
   - Migrations in `/drizzle/`
   - Used for apps, chats, versions, and user settings

2. **File System**
   - App code stored in user's local directory
   - Git integration for version control
   - Virtual filesystem abstraction for preview

### AI Integration

The app integrates with multiple AI providers:

- Anthropic Claude
- OpenAI
- Google AI
- Local models via Ollama/LM Studio
- Custom providers via OpenRouter

Chat streaming uses the Vercel AI SDK with custom handlers for parsing Dyad-specific XML tags in AI responses.

### Testing Strategy

- **Unit Tests**: Vitest for business logic
- **E2E Tests**: Playwright for full app testing
- **Snapshot Testing**: For UI consistency and AI response validation

## Important Patterns and Conventions

1. **Error Handling**: Always throw Error objects in IPC handlers, never return error objects
2. **Locking**: Use `withLock()` for operations that modify shared resources by appId
3. **State Management**: Use Jotai atoms for global UI state, TanStack Query for server state
4. **TypeScript**: Strict typing throughout, avoid `any` types
5. **File Operations**: Always use absolute paths in main process
6. **Git Operations**: Use isomorphic-git library for version control
7. **Process Management**: Track and clean up spawned processes properly

## Security Considerations

- Follow Electron security best practices
- Use contextBridge for IPC exposure
- Validate all inputs from renderer process
- Never expose Node.js APIs directly to renderer
- Sanitize file paths and prevent directory traversal
