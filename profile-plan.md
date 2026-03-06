# Profile Setup Flow

## Overview
Single-page profile setup form with localStorage persistence. Profile data drives pace calculations on the home page.

## Data Model

```typescript
// src/lib/stores/profile.ts
interface LocalProfile {
  name: string;              // User's name for greeting
  prDistanceKm: number;      // Race distance in km
  prTimeSeconds: number;     // Race time in total seconds
  prDate: string;            // Date of the race (ISO format)
  maxHr: number | null;      // Optional max heart rate
  pacePreference: 'km' | 'mi'; // Display pace per km or mile
}
```

## Files

| File | Status |
|------|--------|
| `src/lib/stores/profile.ts` | Created |
| `src/routes/profile/+page.svelte` | Created |
| `src/routes/+page.svelte` | Updated |

## Profile Page Features

### Form Fields
- **Name**: Text input (required) - for personalized greeting
- **Race Distance**: Dropdown with presets (5K, 10K, 15K, Half, Marathon) + Custom option
- **Race Time**: Minutes and seconds inputs
- **Race Date**: Date picker (defaults to today)
- **Max HR**: Optional number input
- **Pace Preference**: km/mi toggle switch

### Race Distance Presets
| Label | km |
|-------|-----|
| 5K | 5 |
| 10K | 10 |
| 15K | 15 |
| Half Marathon | 21.0975 |
| Marathon | 42.195 |

### Behavior
- Form validates distance > 0 and time > 0
- On submit: saves to localStorage, redirects to home
- Pre-fills when editing existing profile

## Home Page Changes
- Shows personalized greeting "Hey, {name}" when profile exists
- Shows "Set Up Profile" CTA card when no profile exists
- Shows workout info with calculated paces when profile exists
- "Edit Profile" link at bottom when profile exists

## Storage
- Key: `sweet-spot-profile`
- Persists in browser localStorage
- Loaded on page mount via `profileStore.load()`

## Routes
- `/` - Home page (shows CTA or workout based on profile)
- `/profile` - Profile setup/edit form
