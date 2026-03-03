# Stage Wizard UX Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the UI flow into a 3-stage wizard so first-time users can complete upload -> generate/edit -> export in one pass.

**Architecture:** Keep existing PDF/TOC core logic and refactor only page composition and interaction gates. Centralize stage state in `+page.svelte`, render stage-specific panels in `SidebarPanel`, and keep preview area stable with a single upload entry. Fix two UX defects during refactor: API config confusion and stuck AI-format loading.

**Tech Stack:** SvelteKit, Svelte 5, TypeScript, TailwindCSS, existing local stores and components.

---

### Task 1: Stage State and Flow Guards

**Files:**
- Modify: `src/routes/+page.svelte`
- Test: Manual flow test in browser

**Step 1: Add stage state and transition handlers**

```ts
let stage: 1 | 2 | 3 = 1;
const goToStageOne = async () => {};
const goToStageTwo = async () => {};
const goToStageThree = async () => {};
```

**Step 2: Implement transition guard rules**

```ts
if ($tocItems.length === 0) {
  toastProps = { show: true, message: '目录为空，请先生成或手动添加目录项。', type: 'error' };
  return;
}
```

**Step 3: Wire "start stage 2" behavior from stage 1**

```ts
const startStageTwo = async () => {
  if ($tocItems.length > 0) return goToStageTwo();
  await generateTocFromAI();
};
```

**Step 4: Ensure upload resets stage**

```ts
stage = 1;
```

**Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat(ui): add 3-stage wizard flow state and guards"
```

### Task 2: Sidebar Stage-Specific Layout

**Files:**
- Modify: `src/components/panels/SidebarPanel.svelte`

**Step 1: Add `stage` prop and stage-only sections**

```svelte
{#if stage === 1}...{/if}
{#if stage === 2}...{/if}
{#if stage === 3}...{/if}
```

**Step 2: Stage 1 panel composition**
- Keep: API settings, page range selector, start button.
- Remove: editing controls and post-processing controls from this stage.

**Step 3: Stage 2 panel composition**
- Keep: TOC editor and bottom navigation (`上一步`, `下一步`).

**Step 4: Stage 3 panel composition**
- Keep: TOC settings and bottom navigation (`上一步`, `导出`).

**Step 5: Commit**

```bash
git add src/components/panels/SidebarPanel.svelte
git commit -m "feat(ui): split sidebar into stage-based panels"
```

### Task 3: API Settings UX Fix

**Files:**
- Modify: `src/components/settings/ApiSetting.svelte`
- Modify: `src/routes/+page.svelte`

**Step 1: Emit live config changes on input**

```ts
dispatch('change', config);
```

**Step 2: Add dirty state tracking**

```ts
dispatch('dirtyChange', isDirty);
```

**Step 3: Add stage-1 confirm when dirty**

```ts
const confirmed = window.confirm('API 设置有未保存改动，是否使用当前输入值继续？');
```

**Step 4: Commit**

```bash
git add src/components/settings/ApiSetting.svelte src/routes/+page.svelte
git commit -m "fix(ux): avoid unsaved API config confusion"
```

### Task 4: Preview Area Simplification

**Files:**
- Modify: `src/components/panels/PreviewPanel.svelte`
- Modify: `src/components/PdfControls.svelte`
- Modify: `src/routes/+page.svelte`

**Step 1: Render a single viewer mode by stage**

```ts
$: viewerMode = (stage === 1 ? 'grid' : 'single') as 'grid' | 'single';
```

**Step 2: Restrict bottom-right controls**
- Keep upload button always visible.
- Hide preview/export buttons unless explicitly enabled by props.

**Step 3: Commit**

```bash
git add src/components/panels/PreviewPanel.svelte src/components/PdfControls.svelte src/routes/+page.svelte
git commit -m "refactor(ui): simplify preview controls for wizard flow"
```

### Task 5: Text AI Format Loading Reliability

**Files:**
- Modify: `src/components/TocEditor.svelte`

**Step 1: Wrap AI format logic with `try/finally`**

```ts
isProcessing = true;
try { ... } finally { isProcessing = false; }
```

**Step 2: Commit**

```bash
git add src/components/TocEditor.svelte
git commit -m "fix(editor): always reset ai format loading state"
```

### Task 6: Verification

**Files:**
- No code changes required

**Step 1: Run static checks**

```bash
pnpm check
```

Expected: No new errors introduced by this refactor; existing repository baseline issues may remain.

**Step 2: Manual stage walkthrough**
- Upload PDF, validate Stage 1 controls and disabled reasons.
- Run generation and enter Stage 2.
- Edit TOC, move to Stage 3.
- Export PDF and re-upload to restart flow.

**Step 3: Commit docs**

```bash
git add docs/plans/2026-03-03-stage-wizard-ux-design.md docs/plans/2026-03-03-stage-wizard-ux-plan.md
git commit -m "docs(plan): add stage wizard ux design and implementation plan"
```
