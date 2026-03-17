# Snack Haul — Implementation Plan

## Context
Building a greenfield React Native (Expo) app called **Snack Haul** for ages 8-18. The app surveys users on snack preferences during onboarding, then recommends snacks and recipes they might like, with purchase links (monetized via affiliate commissions). The tone is fun, playful, and colorful.

---

## Tech Stack
- **Expo SDK 52+** (New Architecture) with **Expo Router v4** (file-based routing)
- **NativeWind** (Tailwind CSS) for styling
- **Zustand** for state management (persisted via AsyncStorage)
- **Reanimated 3 + Lottie** for playful animations
- **TypeScript** throughout

## APIs & Monetization
- **Open Food Facts** (free, 2.5M+ products) — snack product data
- **Spoonacular** — recipe-based snack ideas
- **Instacart affiliate links** (up to 15% commission + $10 per first order) — primary monetization
- COPPA compliance for under-13 users (local-only data, no personal info collection, parent-handoff for purchases)

---

## App Structure

### Routes (file-based)
```
app/
├── _layout.tsx                    # Root: NativeWind provider, font loading
├── index.tsx                      # Redirect: onboarding vs tabs
├── (onboarding)/
│   ├── _layout.tsx                # Stack layout
│   ├── welcome.tsx                # Animated welcome splash
│   ├── age-gate.tsx               # COPPA age check (month/year picker)
│   ├── survey/
│   │   ├── _layout.tsx            # Shared progress bar
│   │   ├── flavors.tsx            # Step 1: Sweet, Salty, Sour, Spicy, etc.
│   │   ├── textures.tsx           # Step 2: Crunchy, Chewy, Crispy, etc.
│   │   ├── dietary.tsx            # Step 3: Allergies & restrictions
│   │   ├── brands.tsx             # Step 4: Favorite categories
│   │   └── results.tsx            # "Snack Profile" reveal + confetti
│   └── profile-create.tsx         # Name + avatar (pre-made avatars only)
├── (tabs)/
│   ├── _layout.tsx                # Bottom tab navigator
│   ├── index.tsx                  # Home / Discover feed
│   ├── search.tsx                 # Browse & filter snacks
│   ├── recipes.tsx                # Snack recipe ideas
│   └── profile.tsx                # Preferences, favorites, settings
├── snack/[id].tsx                 # Snack detail
├── recipe/[id].tsx                # Recipe detail
└── +not-found.tsx
```

### Source Code
```
src/
├── components/
│   ├── ui/          # Button, Card, Chip, ProgressBar, AnimatedPressable
│   ├── survey/      # SurveyOption, SurveyGrid, SurveyNavButtons
│   ├── snack/       # SnackCard, SnackNutrition, BuyButton, SimilarSnacks
│   └── recipe/      # RecipeCard, IngredientList, StepList
├── stores/
│   ├── useAppStore.ts        # { hasCompletedOnboarding, theme }
│   ├── useUserStore.ts       # { name, avatarId, ageGroup, coppaRestricted }
│   ├── useSurveyStore.ts     # { currentStep, answers, snackProfileLabel }
│   ├── useSnackStore.ts      # { cache, feedIds, searchResults }
│   └── useFavoritesStore.ts  # { snackIds, recipeIds }
├── services/
│   ├── api/
│   │   ├── client.ts            # Rate-limited fetch wrapper
│   │   ├── openFoodFacts.ts     # Product search & browse
│   │   ├── spoonacular.ts       # Recipe search
│   │   └── types.ts
│   ├── affiliate/
│   │   └── instacart.ts         # Affiliate link generation
│   └── recommendations/
│       ├── engine.ts            # Fetch → map → score → sort
│       ├── scoring.ts           # Weighted tag matching
│       └── tags.ts              # OFF tag → internal tag mapping
├── hooks/
│   ├── useRecommendations.ts
│   ├── useSnackSearch.ts
│   └── useCOPPA.ts
├── constants/
│   ├── colors.ts     # Coral-orange primary, teal secondary, purple accent
│   ├── survey.ts     # All survey option data
│   └── config.ts     # API keys, feature flags
├── utils/
│   └── storage.ts    # AsyncStorage wrapper
└── types/
    ├── snack.ts
    ├── recipe.ts
    └── survey.ts
```

---

## Key Design Decisions

### Survey UX: Tappable Grid
- Each step shows a grid of illustrated tiles (not swipe cards — more accessible for ages 8-18)
- Tiles animate on select (Reanimated scale bounce + color change)
- Each step has a color accent (orange → teal → purple → yellow)
- Final "results" screen reveals a fun "Snack Profile" label (e.g., "Crunchy-Sweet Explorer!") with Lottie confetti

### COPPA Compliance
- Age gate collects month/year only (not full birthdate)
- Under-13 users: all data stays on-device, no account creation, pre-made avatars only, "Ask a parent!" on purchase buttons (share link to parent via share sheet)
- `useCOPPA` hook gates restricted features throughout the app
- Privacy policy + "Parents" section in Profile tab

### Recommendation Algorithm
- Client-side weighted tag matching: `score = 0.40×flavor + 0.25×texture + 0.20×category + 0.10×novelty + 0.05×popularity`
- Dietary restrictions are a **hard filter** (score = -Infinity)
- Products cached 24 hours in Zustand store
- Open Food Facts tags mapped to internal taxonomy via curated dictionary

### Color Palette
- Primary: `#FF6B4A` (warm coral-orange — energetic, appetizing)
- Secondary: `#2DD4A8` (bright teal — fresh, healthy)
- Accent: `#8B5CF6` (playful purple — fun, youthful)
- Tertiary: `#FBBF24` (sunny yellow)
- Background: `#FFF8F5` (warm off-white)
- Text: `#1F1714` (warm dark brown, not pure black)

---

## Build Phases

### Phase 1: Scaffolding
- Init Expo project, install deps, configure NativeWind + Tailwind
- Set up root layout, file structure skeleton, verify routing

### Phase 2: Onboarding & Survey
- Zustand stores (survey, user, app) with AsyncStorage persistence
- Survey UI components (SurveyOption, SurveyGrid, ProgressBar)
- All onboarding screens: welcome → age gate → 4 survey steps → results → profile create
- Root redirect logic based on onboarding completion

### Phase 3: API & Recommendations
- Open Food Facts integration with rate limiting
- Tag mapping and recommendation scoring engine
- Snack store with caching

### Phase 4: Main App Screens
- Home feed (personalized recommendations), Search, Snack detail
- Spoonacular integration, Recipes tab, Recipe detail
- Favorites system, Profile screen with "retake survey"

### Phase 5: Affiliate & Polish
- Instacart affiliate link generation + BuyButton (COPPA-aware)
- Reanimated micro-interactions, animated tab bar, haptic feedback
- Loading skeletons, error/empty states, accessibility pass

---

## Verification
- Run `npx expo start` after Phase 1 to confirm routing works
- Test full onboarding flow end-to-end after Phase 2
- Verify Open Food Facts API responses + recommendation scoring after Phase 3
- Test affiliate links open correctly in system browser after Phase 5
- Verify COPPA: under-13 flow shows "Ask a parent!" and no data leaves device
