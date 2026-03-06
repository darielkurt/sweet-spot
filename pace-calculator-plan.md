# Pace Calculator with Condition Adjustments

## Overview
Add a pace adjustment system that lets runners tweak paces based on conditions (temperature, wind, hills, surface) with a toggle to show baseline vs adjusted paces.

## User Choices
- **Hills**: Effort-based categories (Flat/Rolling/Hilly/Steep) with conservative adjustments
- **Surfaces**: Simple Track/Road/Trail (keep existing)
- **UI Location**: Both - expandable panel on home + dedicated `/calculator` page
- **Toggle Behavior**: Per-workout (conditions can be saved to journal)

## Implementation Steps

### Step 1: Extend Core Logic
**File:** `src/lib/utils/pace.ts`

- Add `HillType = 'flat' | 'rolling' | 'hilly' | 'steep'`
- Add `HILL_ADJUSTMENTS` constant:
  - Flat: 0s, Rolling: +5s, Hilly: +12s, Steep: +20s per km
- Extend `ConditionAdjustments` interface to include `hill: HillType`
- Update `calculatePaceAdjustment()` to include hill adjustment
- Add `getDefaultConditions()` helper

### Step 2: Update Database Types
**File:** `src/lib/types/database.ts`

- Add `hill` column type to `journal_entries` table definition

### Step 3: Create Conditions Store
**New file:** `src/lib/stores/conditions.ts`

- Svelte writable store for per-session condition state
- Methods: `update()`, `reset()`, `set()`

### Step 4: Add Collapsible Component
- Run `npx shadcn-svelte@latest add collapsible` to add the component

### Step 5: Create PaceAdjustmentPanel Component
**New file:** `src/lib/components/PaceAdjustmentPanel.svelte`

Reusable component with:
- Toggle switch (Baseline vs Adjusted)
- Total adjustment display (+X sec/km)
- Temperature slider (-10 to 40°C)
- Wind selector (Calm/Light/Moderate/Strong)
- Hill selector (Flat/Rolling/Hilly/Steep)
- Surface selector (Track/Road/Trail)
- `compact` prop for home vs full page mode

### Step 6: Add Expandable Panel to Home Page
**File:** `src/routes/+page.svelte`

- Import conditions store and PaceAdjustmentPanel
- Add collapsible card below "Today's Workout"
- Update pace display to apply adjustments when toggle is on

### Step 7: Create Calculator Page
**New file:** `src/routes/calculator/+page.svelte`

Full-featured page showing:
- All condition adjustments (full panel, not compact)
- All workout paces with baseline/adjusted toggle
- Sweet spot paces (3', 7', 10')
- Easy pace range

### Step 8: Add Navigation
**File:** `src/routes/+page.svelte`

- Add "Pace Calculator" link in footer alongside "Edit Profile"

### Step 9: Database Migration (optional, for journal persistence)
- Add `hill` column to `journal_entries` table

## Files to Modify
1. `src/lib/utils/pace.ts` - Add hill logic
2. `src/lib/types/database.ts` - Add hill type
3. `src/routes/+page.svelte` - Add collapsible panel

## Files to Create
1. `src/lib/stores/conditions.ts` - Conditions store
2. `src/lib/components/PaceAdjustmentPanel.svelte` - Reusable panel
3. `src/routes/calculator/+page.svelte` - Full calculator page

## Hill Adjustment Values
| Category | Adjustment |
|----------|------------|
| Flat     | +0 sec/km  |
| Rolling  | +5 sec/km  |
| Hilly    | +12 sec/km |
| Steep    | +20 sec/km |

## Verification
1. Run `npm run dev` and navigate to home page
2. Expand the pace adjustment panel - verify sliders/selectors work
3. Toggle between baseline/adjusted - verify pace changes
4. Navigate to `/calculator` - verify full page displays all paces
5. Adjust conditions and verify total adjustment calculation is correct
6. Run `npm run check` to verify TypeScript types
