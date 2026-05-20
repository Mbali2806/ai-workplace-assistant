# AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate everyday workplace tasks using AI. Built as a clean SaaS-style dashboard with sidebar navigation, responsive design, and editable AI outputs.

---

## Project Overview

The **AI Workplace Productivity Assistant** streamlines repetitive work by combining five focused AI tools into a single platform. It features a polished dashboard UI, structured AI prompts that produce consistent outputs, and the ability to edit every AI-generated result before using it. A built-in responsible AI disclaimer reminds users to verify AI outputs before sharing them in professional contexts.

### Problem Statement

Professionals spend significant time on repetitive administrative tasks—drafting emails, summarizing meetings, planning schedules, conducting research, and managing ad-hoc queries. These activities reduce focus on high-priority work and can lead to stress and burnout.

### Solution

This application provides dedicated tools for each of these tasks, powered by AI with expert system prompts. Users get fast, structured outputs and full control to refine results before use.

---

## Features

- **Smart Email Generator** – Draft polished emails by specifying recipient, purpose, tone, and key points. Output is editable before sending.
- **Meeting Notes Summarizer** – Paste raw notes and get a structured summary with decisions, action items, and owners.
- **AI Task Planner** – Describe a goal and receive a milestone breakdown with concrete tasks, priorities, and time estimates.
- **AI Research Assistant** – Request a briefing on any topic and receive a balanced, sourced summary with key takeaways.
- **AI Chatbot Interface** – A conversational copilot for quick questions, brainstorming, and guidance.
- **Editable AI Outputs** – Every generated result can be reviewed and modified inline.
- **Responsible AI Disclaimer** – In-app reminders that AI outputs should be verified for accuracy and appropriateness.
- **Responsive Design** – Works seamlessly on desktop, tablet, and mobile with a collapsible sidebar and adaptive layouts.
- **Local Persistence** – Tool inputs and outputs are saved locally in the browser so nothing is lost on refresh.

---

## Tools Used

| Category | Technology |
|----------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| AI SDK | Vercel AI SDK (`ai` package) |
| AI Gateway | Lovable AI Gateway |
| Routing | TanStack Router (file-based) |
| State & Effects | React hooks + `use-local-storage-state` |
| Server Functions | TanStack Start `createServerFn` |
| Deployment | Cloudflare Workers (Edge) |

---

## Setup Instructions

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20+
- A [Lovable](https://lovable.dev) account with AI Gateway enabled (provides the `LOVABLE_API_KEY`)

### Installation

1. **Clone or open the project** in Lovable.

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Set up the AI Gateway key:**
   The project requires a `LOVABLE_API_KEY` environment variable. If it is not already configured, the Lovable AI Gateway setup will prompt you to create one automatically.

4. **Run the development server:**
   ```bash
   bun run dev
   ```
   The app will be available at `http://localhost:3000`.

### Build & Deploy

- **Preview build** (for testing):
  ```bash
  bun run build
  ```

- **Production deploy** is handled automatically by Lovable when you publish the project.

### Project Structure

```
src/
  components/        # Reusable UI components (sidebar, panels, AI elements)
  routes/            # File-based pages and API routes
    api/
      chat.ts        # Streaming chat endpoint
      generate.ts    # One-shot generation endpoint
    index.tsx        # Dashboard home
    email.tsx        # Smart Email Generator
    meetings.tsx     # Meeting Notes Summarizer
    planner.tsx      # AI Task Planner
    research.tsx     # AI Research Assistant
    chat.tsx         # AI Chatbot
  lib/               # Utilities, AI gateway client, local storage helpers
  styles.css         # Tailwind theme tokens and design system
public/              # Static assets (robots.txt, llms.txt)
```

---

## Responsible AI Usage

AI-generated content can contain inaccuracies, outdated information, or unintended bias. Always review and edit outputs before using them in professional or high-stakes contexts. The app includes a visible disclaimer to reinforce this practice.
