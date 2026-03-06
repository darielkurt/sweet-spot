# Sweet Spot App - Implementation Plan

## Overview
A PWA for Norwegian Singles Approach (NSA) runners to visualize workouts, adjust based on conditions, and journal their training.

## Tech Stack
- **Frontend:** SvelteKit 2 (latest)
- **Backend/Auth:** Supabase (Postgres + Auth)
- **PWA:** Vite PWA plugin
- **Styling:** shadcn-svelte (Tailwind + Bits UI components)
- **Hosting:** Vercel or Netlify

## MVP Features

### 1. Authentication & Profile Setup
- Email/password auth via Supabase
- Profile: max HR, recent PR (distance + time + date), pace preference (km/mi)

### 2. Pace Calculations (User provides formulas)
- Calculate sweet spot pace ranges from recent PR
- Generate baseline workouts:
  - 3 x 10 min @ sweet spot pace
  - 5 x 7 min @ sweet spot pace
  - 10 x 3 min @ sweet spot pace
- Calculate easy pace range

### 3. Weekly Schedule (Fixed Template)
- Display week view with workout types per day
- Quality workouts, easy runs, long run, rest days
- "Workout of the Day" based on current date

### 4. Condition Adjustments
- Sliders for: temperature, wind, humidity
- Toggle for surface: trail / concrete / asphalt
- Pre-run feeling: 1-10 scale
- Adjusted pace recommendation based on conditions
- Toggle to show baseline vs adjusted workout

### 5. Post-Run Journal
- Quick submit if followed suggested workout
- Notes field for additional thoughts
- Stores: date, workout type, pace, conditions, feeling, notes

### 6. Journal View
- List/calendar view of past entries
- Filter by workout type, date range

## Database Schema (Supabase)

```sql
-- Users profile extension
profiles (
  id uuid references auth.users,
  max_hr int,
  recent_pr_distance_km decimal,
  recent_pr_time_seconds int,
  recent_pr_date date,
  pace_preference text ('km' | 'mi'),
  created_at timestamp
)

-- Journal entries
journal_entries (
  id uuid,
  user_id uuid references profiles,
  date date,
  workout_type text,
  planned_pace_min_km decimal,
  actual_pace_min_km decimal,
  temperature int,
  humidity int,
  wind int,
  surface text,
  pre_run_feeling int,
  notes text,
  created_at timestamp
)
```

## Project Structure

```
sweet-spot-app/
├── src/
│   ├── lib/
│   │   ├── components/     # UI components
│   │   ├── stores/         # Svelte stores
│   │   ├── utils/          # Pace calculations, helpers
│   │   └── supabase.ts     # Supabase client
│   ├── routes/
│   │   ├── +layout.svelte  # App shell
│   │   ├── +page.svelte    # Home/Dashboard
│   │   ├── auth/           # Login/signup
│   │   ├── profile/        # Profile setup
│   │   ├── workout/        # Workout of the day
│   │   ├── schedule/       # Weekly schedule
│   │   └── journal/        # Journal entries
│   └── app.html
├── static/
│   └── manifest.json       # PWA manifest
├── svelte.config.js
├── vite.config.ts
└── package.json
```

## Implementation Phases

### Phase 1: Project Setup
- Initialize SvelteKit project
- Configure Supabase connection
- Setup TailwindCSS
- Configure PWA manifest

### Phase 2: Auth & Profile
- Implement auth pages (login/signup)
- Create profile setup flow
- Store user preferences

### Phase 3: Pace Calculator
- Implement NSA pace formulas (placeholder based on research, refine later)
- Generate baseline workouts
- Unit conversion (km/mi)

**Placeholder Pace Guidelines (from norwegiansingles.run):**
| Interval Length | Target Pace |
|-----------------|-------------|
| 3 min (10x3')   | ~15K race pace |
| 7 min (5x7')    | ~Half marathon pace |
| 10 min (3x10')  | ~25-30K pace |

**Easy pace:** Max 70% max HR
**Threshold estimate:** 5-10 sec/km slower than VDOT threshold pace

*User will provide exact formulas from book later*

### Phase 4: Schedule & Workout View
- Build weekly schedule component
- Create workout of the day page
- Add condition sliders and adjustments

### Phase 5: Journal
- Post-run entry form
- Journal list/view page
- Basic filtering

### Phase 6: PWA & Polish
- Configure service worker
- Add offline support
- Test installability

## Verification
- Test auth flow end-to-end
- Verify pace calculations with known values
- Test PWA installation on mobile
- Verify journal entries persist in Supabase

## Notes
- Pace formulas are placeholders; user will provide exact formulas from NSA book later
- Using shadcn-svelte for UI components
- Weekly schedule uses fixed NSA template
