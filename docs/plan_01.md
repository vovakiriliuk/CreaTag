# CreaTag 30-Day Development Plan (Plan 01)

## Goal
Stabilize core framework behavior (routing + reactivity), fix high-risk defects, and establish a minimum quality baseline for continued feature work.

## Success Criteria (End of Day 30)
- Infinity scroll works correctly with real DOM access and has basic test coverage.
- Router supports internal navigation, nested anchor clicks, and browser back/forward sync.
- Reactive effects support cleanup/disposal to avoid stale subscriptions.
- At least 12 automated tests exist across core critical modules.
- Package health is improved (consistent build scripts and dependency hygiene).

---

## Week 1 (Days 1-7): Critical Stability Fixes

### 1. Fix InfinityScroll implementation
- Replace invalid Tag-level DOM assumptions with a safe mounted-element strategy.
- Ensure scroll metrics read from actual HTMLElement.
- Add guardrails for missing mount state.

Deliverables:
- Refactored InfinityScroll component API and implementation.
- Manual verification in playground with long list loading.

### 2. Harden routing click interception
- Use delegated click handling via closest('a') instead of direct event.target tag checks.
- Respect modifier keys (Ctrl/Cmd click, middle click) to preserve native behavior.
- Skip external links and downloads.

Deliverables:
- Updated route interception logic.
- Regression checklist for navigation behavior.

### 3. Add popstate support
- Handle browser back/forward by listening to popstate.
- Keep route state and rendered content synchronized.

Deliverables:
- popstate integration.
- Manual test flow documented in PR notes.

---

## Week 2 (Days 8-14): Reactivity and Lifecycle Safety

### 1. Add effect cleanup/disposal
- Make effect return a disposer.
- Track dependencies per effect and clean before re-run.
- Prevent subscriber leaks when nodes are replaced/unmounted.

Deliverables:
- Updated signal/effect implementation.
- Builder integration for teardown hooks.

### 2. Reduce listener leaks in composables
- Refactor window-size composable to avoid multiple unmanaged global listeners.
- Add shared singleton pattern or explicit dispose support.

Deliverables:
- Revised composable API.
- Playground validation for repeated component creation/remounts.

### 3. Tighten route guard semantics
- Clarify and implement true in-app beforeEach/afterEach behavior on route transitions.
- Keep unload guards separate and explicitly named.

Deliverables:
- Guard API split and documentation comments.
- Migration notes for existing usage.

---

## Week 3 (Days 15-21): Type Safety + Testing Baseline

### 1. Improve type contracts in state modules
- Replace broad Function/any with typed generics for reducers, middleware, selectors.
- Add typed action shape and reducer map constraints.

Deliverables:
- Typed store utility APIs.
- Example typed usage in playground.

### 2. Add core unit tests
Target modules:
- signal/effect behavior (subscribe, update, cleanup)
- router navigation and popstate
- builder reactive text/children updates
- InfinityScroll behavior

Deliverables:
- 12+ tests minimum.
- Test command integrated at root and package level.

### 3. Add CI quality gate
- Run typecheck, build, and tests on pull requests.
- Ensure failures block merges.

Deliverables:
- CI workflow file.
- Green baseline build.

---

## Week 4 (Days 22-30): Packaging, DX, and Documentation

### 1. Package hygiene pass
- Ensure each package has correct main/module/types/exports and build scripts.
- Move build-only tooling (like TypeScript) to devDependencies where appropriate.
- Decide status of render-dom (implemented vs explicit placeholder).

Deliverables:
- Updated package manifests.
- Successful pnpm -r build locally and in CI.

### 2. Documentation for contributors
Create concise docs:
- Architecture overview (Tag model, render flow, routing, reactivity)
- API usage examples
- Common pitfalls and best practices

Deliverables:
- docs/architecture.md
- docs/getting-started.md
- docs/contributing.md

### 3. Release-readiness review
- Re-run full test suite and manual scenarios.
- Create backlog for post-30-day enhancements.

Deliverables:
- Release-readiness checklist.
- Prioritized backlog for next cycle.

---

## Suggested Daily Cadence
- Day start: 15 min planning (pick 1 primary + 1 secondary task).
- Midday: commit small vertical slices.
- End of day: short status note with completed, blocked, next.

---

## Risk Register (Active Monitoring)
- Reactive cleanup complexity may require internal API changes.
- Router changes can introduce regressions in link behavior.
- Test harness setup may take longer if tooling is undecided.

Mitigation:
- Keep changes incremental.
- Add tests alongside each fix.
- Maintain playground manual smoke checklist.

---

## Stretch Goals (If Ahead of Schedule)
- Add SSR-safety checks to DOM-dependent code paths.
- Introduce lightweight devtools logging for signals/routes.
- Add keyed children diffing to reduce re-render churn.