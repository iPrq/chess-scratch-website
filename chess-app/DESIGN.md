```markdown
# Design System Strategy: The Grandmaster’s Study

## 1. Overview & Creative North Star
The North Star for this design system is **"The Grandmaster’s Study."** 

This isn't a typical sports app; it is a high-end editorial experience that treats every chess match like a scholarly pursuit. We move away from the "gamified" chaos of neon colors and heavy borders. Instead, we embrace **Tactile Minimalism**. 

The design breaks the standard digital template through **Intentional Asymmetry**. We use expansive whitespace (the "breath" between moves) and high-contrast typography scales to create an environment that feels both professional and intellectually quiet. Elements should feel like they are laid out on a physical mahogany and cream table—heavy, intentional, and premium.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the heritage of the game: forest greens, bone-colored creams, and charcoal blacks.

*   **Primary (#154212):** Used sparingly for "The Killing Blow"—winning states, primary CTAs, or critical path highlights.
*   **Surface Hierarchy (The Nesting Rule):** We forbid the use of 1px solid borders for sectioning. To define a workspace, use background shifts:
    *   **Base:** `surface` (#f8faf4).
    *   **Secondary Content:** `surface-container-low` (#f3f4ef).
    *   **Interactive Cards:** `surface-container-lowest` (#ffffff) to create a "lifted" paper effect.
*   **The "No-Line" Rule:** Boundaries must be felt, not seen. Separate the move list from the board using a shift from `surface` to `surface-container-high` (#e7e9e3).
*   **Signature Textures:** For the main "Play" buttons or Hero headers, use a subtle linear gradient from `primary` (#154212) to `primary-container` (#2d5a27) at a 135-degree angle. This adds "soul" and depth that prevents the UI from looking like a flat wireframe.

---

## 3. Typography: The Editorial Edge
We pair the technical precision of **Inter** with the structural elegance of **Manrope** to create a system that feels like a premium chess journal.

*   **Display (Manrope):** Use `display-lg` (3.5rem) for grand-scale announcements (e.g., "Checkmate"). The tight tracking and large scale convey authority.
*   **Headlines (Manrope):** `headline-md` (1.75rem) should be used for section titles. Ensure generous top-margin (Spacing 12 or 16) to allow the "Grandmaster" breathing room.
*   **Body & Labels (Inter):** High-readability sans-serif for technical data—move notation and clock timers. Use `body-md` (0.875rem) for the majority of UI text to maintain a sophisticated, small-print feel common in luxury brands.

---

## 4. Elevation & Depth
Depth in this system is a result of **Tonal Layering**, not structural scaffolding.

*   **The Layering Principle:** To highlight a player’s profile, place a `surface-container-lowest` card on top of a `surface-container-low` background. This creates a natural "paper on felt" lift.
*   **Ambient Shadows:** When an element must float (like a piece promotion modal), use a `shadow-lg` equivalent: a 24px blur with only 4% opacity, using a tint of `on-surface` (#191c19). It should feel like a soft shadow cast by a library lamp.
*   **Glassmorphism (The "Frosted Overlay"):** For HUD elements during gameplay, use `surface-variant` at 60% opacity with a `backdrop-filter: blur(12px)`. This keeps the focus on the board while providing a legible surface for UI controls.
*   **Ghost Borders:** If accessibility requires a stroke, use `outline-variant` (#c2c9bb) at 15% opacity. Never use a 100% opaque border.

---

## 5. Components

### Buttons
*   **Primary:** Rounded `xl` (1.5rem). Background is the Signature Gradient (Primary to Primary-Container). Text is `on-primary` (#ffffff).
*   **Tertiary:** No background, no border. Use `title-sm` with 2.5 spacing for internal padding. Hover state is a subtle shift to `surface-container-high`.

### The Move Card
*   **Style:** No borders. Use `surface-container-lowest`.
*   **Layout:** Instead of a list divider, use Spacing 4 between moves. Use `tertiary` (#393a29) for the move number and `on-surface` (#191c19) for the piece notation.

### Input Fields
*   **Style:** A soft `surface-container-highest` (#e1e3de) fill. 
*   **State:** On focus, do not use a heavy outline. Instead, shift the background to `surface-container-lowest` and add a "Ghost Border" of `primary` at 20% opacity.

### Chess Board UI
*   **Cells:** Use `primary-container` (#2d5a27) for dark squares and `tertiary-fixed` (#e4e4cc) for light squares. This avoids the high-fatigue "pure black and white" contrast.
*   **Selection:** Instead of a thick border, a selected square should have a subtle inner-glow (inset shadow) of `primary-fixed-dim`.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetric Padding:** Allow a "sidebar" to have more leading space than trailing space to create an editorial, off-center feel.
*   **Leverage Whitespace:** If two elements feel cluttered, add Spacing 8 (2.75rem) rather than adding a divider line.
*   **Use Tonal Shifts:** Define the "Player vs Player" areas by nesting them in different `surface-container` tiers.

### Don’t:
*   **Don't use 1px solid lines:** This is the quickest way to make a premium system look like a generic dashboard.
*   **Don't use pure Black (#000):** Use `on-surface` (#191c19) for text and `primary` (#154212) for depth to maintain the forest-inspired warmth.
*   **Don't crowd the board:** The chess board is the hero. Ensure it has at least Spacing 10 (3.5rem) of margin from any other UI element.

---

## 7. Spacing & Rhythm
Rhythm is controlled by a strict 0.35rem increment. 
*   **Container Padding:** Always use `spacing-6` (2rem) for internal card padding to ensure a luxury "airy" feel.
*   **Section Gaps:** Use `spacing-16` (5.5rem) between major functional blocks (e.g., Board and Analysis tools). This creates the "Professional/Technical" vibe requested.```