# LAPDOS UI Design & Layout Architecture

This document serves as a comprehensive reference guide for the UI/UX architecture, layout structures, styling paradigms, and interactive features of the LAPDOS platform, derived from the core templates, CSS, and JS files.

## 1. Design System & Theming (`lapdos.css`)

### Color Palette & Typography
- **Backgrounds**: Light Grey (`#DFE2E0`), Surface White (`#FFFFFF`), Surface Alt (`#F4F6F5`).
- **Accents**: Primary Lime Green (`#CCF56A`), Dark Green (`#A5D13B`), Brand Red (`#FF6B6B`), Blue (`#E8F0FE`).
- **Text & UI**: Dark (`#1E2024`), Text Main (`#17181A`), Text Muted (`#85888C`).
- **Typography**: The primary and display font is `'Inter', system-ui, sans-serif` prioritizing clean, highly legible modern sans-serif aesthetics.

### Animation & Micro-interactions
- **Fade In**: Built-in `@keyframes fadeIn` with classes `.animate-fade-in` and `.stagger-1`, `.stagger-2`, `.stagger-3` for cascading content entry.
- **Hover States**: Cards, buttons, and navigation links have slight Y-axis translations (`translateY`) paired with increased shadow depth.

## 2. Global Layout Structure (`base.html`)

The application utilizes a CSS Flexbox-based split-pane design paradigm inside `body.layout-body`:

### Sidebar (`aside.sidebar`)
- Fixed width of `280px` transitioning to `100px` when collapsed (`.sidebar.collapsed`).
- Houses the brand logo, user profile summary snippet, navigation links, and auth buttons.
- Navigation utilizes `.nav-link` with a distinct `.active` state (Lime Green background + shadow).

### Main Workspace (`main.main-wrapper`)
- Flexibly consumes remaining viewport width.
- Features a `.top-header` with theme toggles, notification bell, and quick AI action button.
- Primary content container is `.content-scrollable` encompassing `.content-container` (max-width `1400px`).

## 3. Core Widgets & Components

- **Cards**: 
  - `.glass-card` / `.feature-card`: Core flat white cards with subtle borders (`1px solid var(--border)`) and small drop shadows.
  - `.stat-card`: Centered alignment layout for numeric metrics with prominent icons.
  - `.module-card`: Complex flex-column layout with headers, metadata tags, and action footers.
- **Buttons**:
  - `.btn-primary`: Dark solid background (`#1E2024`) with white text. (Note: overriden in Blogs to Peach `#E07A5F`).
  - `.btn-secondary`: Primary Lime Green background with dark text.
- **Badges**:
  - Rounded pills `.badge` with variants `.badge-red`, `.badge-green`, `.badge-blue`, and `.badge-glass` for category tagging and status labels.

## 4. App-Specific Structures

### Blogs App
- **List Layout (`blogs/list.html`)**: 
  - Features an interactive `.filter-section` utilizing JavaScript to show/hide `.blog-card` elements based on `data-filter` matching `data-type`.
  - Grid layout (`.blog-grid`) displaying cover images, type badges, author info, and publication dates.
- **Detail Layout (`blogs/detail.html`)**:
  - Distinctly uses **Tailwind-like utility classes** (e.g., `max-w-3xl`, `mx-auto`, `prose`, `flex`) alongside custom CSS, creating a centralized, readable, rich-text experience.
  - Includes an eye-catching "AI Fact-Check Panel" widget styled with a red border and robot icon.

### Moduloz App
- **Dashboard (`moduloz/dashboard.html`)**:
  - Two-column responsive layout (`.dashboard-layout`: main + right sidebar).
  - Integrates **Chart.js** via CDN rendering a `.radar-container` for visualizing Module Mastery percentage across topics.
  - A Streak Visualization calendar built with `.streak-container` and `.streak-day`.
- **List Layout (`moduloz/list.html`)**:
  - Reuses the `.modules-grid` setup. Separates modules and specific quiz questions into clean, navigable card grids.
- **Detail Layout (`moduloz/detail.html`)**:
  - A highly interactive SPA-like template divided into three JavaScript-toggled sections: 
    1. Content Section (`#contentSection`)
    2. Quiz Form Section (`#quizSection`)
    3. Results Section (`#resultsSection`)
  - Submits quiz forms via Vanilla JS `fetch` API (`application/json` with CSRF headers) preventing page reloads.

## 5. JavaScript Interactions (`lapdos.js`)

The `lapdos.js` file handles all client-side logic using vanilla ES6 JavaScript:
1. **Sidebar State**: Persists the `.collapsed` state into `localStorage`.
2. **Blog Filtering**: Binds click events to `.filter-btn` to toggle visibility of blog grid items.
3. **Form Enhancements**: Automatically injects `.form-input` styling to generic Django auth form fields and manipulates custom file upload labels.
4. **AI Assistant Integration**:
   - Manages tabs (`#aiTabs`) between Chat and Tools.
   - Handles async messaging via `fetch` to `/ai/chat/`, maintaining a `chatHistory` array and auto-scrolling the chat box.
5. **Image Analysis (Drag & Drop)**:
   - Configures `#dropZone` for drag-over and drop events.
   - Pushes `FormData` files to `/ai/analyze/` asynchronously and handles UI loading states.

## Summary for Future Improvements
- **CSS Standardization**: Refactor the utility classes heavily used in `blogs/detail.html` back into `lapdos.css` components (or fully adopt Tailwind) for uniform consistency.
- **Mobile Responsiveness**: Enhance the `.sidebar` transition logic for mobile screens (the current implementation relies on a `#sidebarToggle` which is noted as removed in `base.html` comments).
- **Theme Support**: The UI has `.theme-btn` toggles but `lapdos.css` currently lacks comprehensive Dark Mode CSS variables (`@media (prefers-color-scheme: dark)` or `.dark-theme` classes). Implementing these variable swaps would complete the theming feature.
