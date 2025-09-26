# AI Rules for Application Development

This document outlines the core technologies and best practices to follow when developing this application.

## Tech Stack Overview

*   **Frontend Framework:** React.js for building interactive user interfaces.
*   **Language:** TypeScript for enhanced type safety and developer experience.
*   **Routing:** React Router for client-side navigation and managing application routes.
*   **Styling:** Tailwind CSS for a utility-first approach to styling, ensuring responsive and consistent designs.
*   **UI Components:** shadcn/ui for a collection of accessible and customizable UI components.
*   **Icons:** lucide-react for a comprehensive set of vector icons.
*   **Component Structure:** Small, focused components (ideally < 100 lines) in `src/components/`.
*   **Page Structure:** Top-level views (pages) located in `src/pages/`.
*   **Main Entry Point:** The primary application logic and routing are handled in `src/App.tsx`, with the default page being `src/pages/Index.tsx`.

## Library Usage Rules

*   **UI Components:**
    *   **Always** prioritize using components from `shadcn/ui`.
    *   If a specific `shadcn/ui` component doesn't exist or requires significant modification, create a **new, separate component** in `src/components/`. **Never** modify `shadcn/ui` source files directly.
*   **Styling:**
    *   **Exclusively** use Tailwind CSS classes for all styling. Avoid custom CSS files (`.css`, `.scss`) or inline styles unless absolutely necessary for dynamic, computed values.
    *   Ensure all designs are responsive by utilizing Tailwind's responsive utility classes.
*   **Icons:**
    *   Use `lucide-react` for all icon needs. Import icons directly from this library.
*   **Routing:**
    *   All application routes should be defined and managed using `react-router-dom`.
    *   Keep the main routing configuration within `src/App.tsx`.
*   **File Structure:**
    *   New components **must** be created in their own dedicated files within `src/components/`.
    *   New pages **must** be created in their own dedicated files within `src/pages/`.
    *   Directory names should be all lowercase (e.g., `src/pages`, `src/components`).
*   **Dependencies:**
    *   Before adding a new dependency, check if existing libraries can fulfill the requirement.
    *   If a new dependency is required, use the `<dyad-add-dependency>` command.
*   **Code Quality:**
    *   Write clean, readable, and maintainable code.
    *   Adhere to TypeScript best practices for type safety.
    *   Avoid over-engineering; implement the simplest solution that meets the requirements.