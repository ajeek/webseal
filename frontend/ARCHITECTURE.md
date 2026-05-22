# WebSeal Frontend Visualization Layer Specification

## 1. Full React Component Architecture

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ClaimInputPanel.tsx      # Form for claim text and up to 3 URLs
│   │   ├── EvidenceTimeline.tsx     # Animated pipeline of execution steps
│   │   ├── ConsensusVisualizer.tsx  # High-impact visual of abstract nodes converging
│   │   ├── VerdictCard.tsx          # Cinematic display of final verdict & rationale
│   │   ├── TransactionStatusTracker.tsx # Status badge/tracker for relayer state
│   │   ├── ThemeToggle.tsx          # Nav button for Light/Dark mode
│   │   └── Layout.tsx               # Main container with Nav and Footer
│   ├── context/
│   │   └── ThemeContext.tsx         # Global theme state and localStorage persistence
│   ├── pages/
│   │   └── Dashboard.tsx            # Main view orchestrating the components
│   ├── lib/
│   │   └── webseal.ts               # Thin HTTP wrapper for backend API calls
│   ├── styles/
│   │   └── globals.css              # PostCSS / Tailwind directives & theme variables
```

## 2. Theme System Implementation (Dark/Light mode)

The theme system uses CSS variables injected at the root level, toggled via a `light` or `dark` class on the `<html>` or `<body>` element.

**Design System Tokens:**
*   **Dark Mode (Default):** Deep black (`#0A0A0B`), Navy panels (`#111318`), Neon blue (`#3B82F6`) and purple glow accents, glassmorphism (`bg-white/5` with `backdrop-blur-md`).
*   **Light Mode:** Soft white (`#FAFAFA`), pristine white panels (`#FFFFFF`), bold Indigo accents (`#4F46E5`), clean minimal shadows (`shadow-xl shadow-indigo-500/10`).

## 3. ThemeContext Implementation
*(Conceptual structural implementation)*
```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';
interface ThemeContextType { theme: Theme; toggleTheme: () => void; }

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark

  useEffect(() => {
    const saved = localStorage.getItem('webseal-theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('webseal-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

## 4. UI Design System Specification
- **Typography**: `Inter` (sans-serif) for clean readability. `JetBrains Mono` for transaction IDs, intent hashes, and technical data.
- **Glassmorphism**: Components use translucency (`backdrop-blur-xl bg-white/5` in dark mode, `bg-white/80` in light mode) to create depth.
- **Color Coding**: 
  - TRUE / Verified: Emerald / Green glow.
  - FALSE / Refuted: Rose / Red glow.
  - UNVERIFIABLE: Amber / Yellow glow.
  - Pending / Adjudicating: Blue / Purple pulsing.

## 5. Animation Strategy
*(Powered by motion/react)*
- **Theme Transitions**: `transition-colors duration-500 ease-in-out` on all background and text color utility classes.
- **Pipeline Progression**: `EvidenceTimeline.tsx` uses staggered list animations and glowing pulse effects on active steps.
- **Consensus Convergence**: `ConsensusVisualizer.tsx` uses a particle or node-based SVG animation. 3-5 abstract "validator" nodes pulse independently handling data, then visually "snap" lines into a central "truth lock" node when status hits `SETTLED`.
- **Verdict Reveal**: `VerdictCard.tsx` enters with a spring animation (`type: "spring", stiffness: 100, damping: 15`). The confidence score counts up from 0 to actual value using a number ticker.

## 6. API Integration Layer (`websealClient.ts`)
*(Strictly restricted to backend relayer interaction)*
```typescript
const BASE_URL = '/api/claims';

export const websealClient = {
  submitClaim: async (claim: string, urls: string[]) => {
    const res = await fetch(`${BASE_URL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
      body: JSON.stringify({ claim, urls }),
    });
    return res.json();
  },
  
  adjudicateClaim: async (intent_id: number) => {
    const res = await fetch(`${BASE_URL}/adjudicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent_id }),
    });
    return res.json();
  },
  
  pollStatus: async (intent_id: number) => {
    const res = await fetch(`${BASE_URL}/${intent_id}`);
    return res.json();
  }
};
```

## 7. Dashboard Layout Structure
- **Navigation (Sticky Top)**: Logo ("WebSeal"), Tagline snippet, network indicator (e.g., "GenLayer Testnet"), and `ThemeToggle`.
- **Hero Section**: 
  - Left Column (Input): `ClaimInputPanel.tsx` focused on clean data entry.
  - Right Column / Overlay (Processing): `TransactionStatusTracker.tsx` and `EvidenceTimeline.tsx`.
- **Consensus Theater (Middle)**: `ConsensusVisualizer.tsx` spans the center area once processing begins, making the decentralized validation the centerpiece.
- **Results Stage (Bottom/Modal)**: `VerdictCard.tsx` appears triumphantly displaying the definitive truth evaluation.

## 8. UX Flow Explanation
1. **Idle State**: The user sees the clean `Dashboard` (Dark Mode by default). The cinematic prompt input invites them to submit a claim and attach up to 3 URLs.
2. **Submission**: User clicks "Submit". The `ClaimInputPanel` locks. `websealClient.submitClaim` fires.
3. **Relay & Track**: Upon intent ID reception, `TransactionStatusTracker` appears. The `EvidenceTimeline` proceeds from "Submitted".
4. **Adjudication**: The frontend automatically calls `adjudicateClaim`. The `ConsensusVisualizer` fades in, showing validator nodes pulsing (simulating `gl.nondet.web.render` and `exec_prompt` occurring deep in GenLayer).
5. **Polling**: The frontend polls `pollStatus`. The visualizer loops its "thinking" animation.
6. **Verdict Lock**: Polling returns `SETTLED`. The `ConsensusVisualizer` snaps all nodes to the center.
7. **Reveal**: The `VerdictCard` expands from the center, displaying *TRUE*, *FALSE*, or *UNVERIFIABLE* with a glowing border matching the outcome, accompanied by the confidence score and rationalization.

**Core Rule Maintained Purity**: The frontend completely trusts the backend relayer. It never touches LLMs, scraping tools, or raw GenLayer endpoints. It purely brings the hidden blockchain consensus process to visual life.
