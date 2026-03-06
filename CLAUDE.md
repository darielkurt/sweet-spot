# Sweet Spot App

A running training app for the Norwegian Singles Approach (NSA) methodology. Helps runners calculate sweet spot paces, generate weekly schedules, and journal their training.

## Stack

- **SvelteKit** with Svelte 5, TypeScript, Vite
- **Tailwind CSS** + shadcn-svelte for UI
- **Supabase** for auth and PostgreSQL database
- **PWA** via vite-plugin-pwa

## Project Structure

- `src/routes/` - SvelteKit pages and layouts
- `src/lib/components/ui/` - shadcn-svelte UI components
- `src/lib/utils/` - Core logic (pace calculations, schedule generation)
- `src/lib/types/` - Database types
- `src/lib/supabase.ts` - Supabase client

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run check    # TypeScript/Svelte type checking
```

## Key Files

- `src/lib/utils/pace.ts` - Pace calculation with condition adjustments
- `src/lib/utils/schedule.ts` - Weekly training schedule logic
- `src/lib/types/database.ts` - Supabase schema types
