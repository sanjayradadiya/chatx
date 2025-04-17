# ChatX: AI Chat Web Application

ChatX is a full-stack AI chat web application built with Vite, React, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- User authentication (signup/login)
- Chat interface with AI responses
- Persistent chat history
- Multiple chat sessions
- Responsive design

## Tech Stack

- **Frontend**: Vite, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Authentication, Database)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd chatx
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Enable email/password authentication in Authentication > Providers
3. Run the SQL from `supabase_schema.sql` in the SQL Editor to set up the database schema
4. Get your project URL and anon key from Settings > API

### 4. Configure environment variables

Create a `.env` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

The app should now be running at http://localhost:5173

## Project Structure

- `src/components`: Reusable UI components
- `src/context`: React context providers for state management
- `src/module`: Feature-specific modules (auth, chat, etc.)
- `src/services`: Backend API services (Supabase)
- `src/config`: Configuration and types
- `src/pages`: Page components

## Database Schema

The application uses two main tables:

1. `chat_sessions`: Stores chat sessions with titles
2. `chat_messages`: Stores individual messages within sessions

Row-level security policies are in place to ensure users can only access their own data.

## License

MIT
