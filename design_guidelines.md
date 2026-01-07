# Marathon Training Tracker - Nike-Level Design Guidelines

## Design Approach
**Reference-Based**: Premium Athletic Experience inspired by Nike Run Club, Strava, and Apple Fitness+. This is a performance-focused utility app that requires motivational visual design to drive user engagement and consistency.

## Core Design Principles
1. **Performance Clarity**: Information hierarchy that celebrates progress and achievement
2. **Motivational Presence**: Bold typography and confident layouts that inspire action
3. **Athlete-First UX**: Friction-free interactions optimized for quick check-ins and planning
4. **Premium Finish**: Refined details that convey professional training quality

---

## Typography System

**Font Stack**: 
- Primary: Inter or SF Pro Display (web-safe fallback: system-ui, -apple-system)
- Accent/Numbers: Monument Extended or Bebas Neue for large stats/headers

**Hierarchy**:
- Hero Stats: 48-72px, extra bold (race countdown, total weeks)
- Week Headers: 24-32px, bold, wide letter-spacing (0.05em)
- Workout Titles: 16-18px, semibold
- Workout Details: 14px, regular, line-height 1.6
- Metadata/Labels: 12px, medium, uppercase, tracking-wide

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section spacing: mb-12 to mb-24
- Card gaps: gap-4 to gap-6
- Tight groupings: gap-2

**Grid Structure**:
- Container: max-w-7xl with px-4 to px-8
- Week rows: Horizontal scroll on mobile, full grid on desktop
- Desktop: 7-column grid for days (one per day of week)
- Mobile: 3-4 column grid with wrap, or horizontal scroll

---

## Component Library

### Header/Navigation
- Fixed top bar with glass-morphism effect (backdrop blur)
- Left: Logo/App name
- Center: Current week indicator with progress ring
- Right: Profile, settings, streak counter

### Training Calendar Grid
**Hexagon Day Cells** (existing pattern - enhance):
- Maintain hexagon shape for brand uniqueness
- Add subtle elevation/shadow for completed days
- Progress fill from bottom-up (keep existing)
- Hover: Lift effect with glow
- Active/Today: Pulsing border accent
- Completed: Checkmark overlay, slightly dimmed
- Future: Lower opacity (60%)

**Week Container**:
- Clear week number badge (top-left corner)
- Total distance/time summary (top-right)
- Divider between weeks with week completion percentage

### Workout Detail Modal/Sidebar
- Slide-in panel (mobile) or expanded card (desktop)
- Large workout type badge at top
- Workout title in display font
- Detailed instructions with bullet formatting
- Quick action buttons: "Mark Complete", "Add Notes", "Skip"
- Previous performance comparison (if available)

### Stats Dashboard Section
- Large hero stats: Days trained, Total distance, Current streak
- Progress bars showing weekly/monthly completion
- Achievement badges for milestones
- Mini calendar heat-map of training consistency

### Quick Actions Bar
- Floating bottom bar (mobile) or sidebar (desktop)
- "Log Today's Workout" primary CTA
- "View This Week" secondary action
- Quick access to notes/feelings tracker

---

## Images

**Hero Section**: 
- Full-width cinematic runner image (1920x800px)
- Dramatic lighting, motion blur on runner, in-focus foreground
- Overlay: Motivational tagline + week countdown
- Buttons on hero: Use backdrop-blur-md with semi-transparent backgrounds

**Empty States**:
- Illustration style: Line art runners, minimalist athletic graphics
- Motivational copy-driven rather than image-heavy

**Achievement Moments**:
- Celebratory graphics when completing weeks/milestones
- Could use abstract geometric patterns or athletic imagery

---

## Interaction Patterns

**Micro-interactions** (minimal, purposeful):
- Hexagon completion: Quick scale + checkmark animation
- Stats counter: Count-up animation on page load
- Streak flame: Subtle flicker on active streaks
- Swipe gestures for week navigation on mobile

**Navigation**:
- Horizontal swipe between weeks (mobile)
- Keyboard shortcuts: Arrow keys for week navigation, Space to mark complete
- Smooth scroll to current week on load

---

## Responsive Strategy

**Desktop (lg:)**:
- Full 7-column week grid
- Side-by-side stats + calendar layout
- Expandable workout details panel (right sidebar)

**Tablet (md:)**:
- 4-column grid with wrap
- Collapsible sidebar
- Larger touch targets (min 44px)

**Mobile (base)**:
- Horizontal scrolling weeks (snap to week)
- Bottom sheet for workout details
- Simplified header with hamburger menu
- Sticky week selector

---

## Accessibility Standards
- WCAG AA contrast ratios for all text
- Clear focus indicators on hexagons and buttons
- Skip links for keyboard navigation
- Descriptive aria-labels for workout types and completion status
- Touch targets minimum 44x44px on mobile

---

## Premium Polish Details
1. **Consistent shadows**: Single shadow system (sm, md, lg) for depth hierarchy
2. **Smooth transitions**: 200-300ms ease-in-out for all state changes
3. **Loading states**: Skeleton screens for calendar data, shimmer effect
4. **Edge cases**: Empty week states, rest day messaging, missed workout recovery suggestions
5. **Data visualization**: Clean progress bars, circular progress rings for completion percentage
6. **Feedback**: Success toasts for completions, encouraging micro-copy throughout

---

This creates a premium training companion that balances Nike's inspirational athleticism with the functional clarity needed for consistent training tracking.