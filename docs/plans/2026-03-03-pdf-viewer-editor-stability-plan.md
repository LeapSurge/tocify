# PDF Viewer/Editor Stability Refactor Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve maintainability and runtime stability of the original PDF workflow while keeping all existing PDF preview/edit/export features.

**Architecture:** Extract page-level control helpers, normalize API error/timeout behavior, and introduce explicit PDF rendering cache lifecycle management.

**Tech Stack:** SvelteKit, pdfjs-dist, pdf-lib, OpenAI/Gemini SDKs, Vitest.

---

Completed in this branch:
- Added TDD harness with Vitest and tests for:
  - API retry/error helpers
  - LRU render cache
  - local persistence helpers
  - TOC offset/root-node helper
- Refactored API `/api/process-toc` for:
  - JSON-only error responses
  - origin allowlist via env + Vercel URL fallback
  - provider call timeout + retry guard
  - fixed provider routing bug in zhipu branch
- Refactored page control logic by extracting:
  - local persistence helpers (`src/lib/page/local-persistence.ts`)
  - TOC offset/root-node helper (`src/lib/page/toc-offset.ts`)
- Improved PDF runtime lifecycle in `PDFService`:
  - LRU image cache for AI page snapshots
  - cache clear on preview re-init
  - explicit `destroy()` cleanup for worker/callback/cache
