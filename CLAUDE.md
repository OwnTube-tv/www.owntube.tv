# OwnTube.tv Website Development Guidelines

## Commands

- `npm run dev` - Start development server (runs on port 8080)
- `npm run build` - Build for production (static site generation)
- `npm run build:dev` - Build for development
- `npm run lint` - Run Astro type checker
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

## Code Style

- **TypeScript**: Use TypeScript for type safety
- **Imports**: Use path aliases with `@/*` for src directory imports
- **Formatting**:
  - Double quotes, 2 space indentation, 120 char line limit
  - Semicolons required, trailing commas for ES5
- **Components**: Astro components (`.astro` files) for all pages and layouts

## Project Structure

- Astro static site with Tailwind CSS
- Layouts in src/layouts (RootLayout with per-page metadata)
- Pages in src/pages (file-based routing)
- Shared components in src/components
- Static data in src/data
- Global styles in src/index.css
- Development server runs on port 8080 with IPv6 support

## Architecture Notes

- **Static Generation**: Astro builds each `.astro` page to static HTML
- **Per-Page Metadata**: Each page sets its own title, description, og:url, and canonical via layout props
- **Path Aliases**: `@/*` maps to `src/*` directory
- **Zero JavaScript**: No client-side JS framework; only minimal inline scripts (mobile menu toggle)
- **Homepage**: Both `/` and `/apps` render identical content via shared `HomeContent.astro` component
- **JSON-LD**: Structured data defined in `index.astro` frontmatter, embedded in page head
- **CI/CD**: GitHub Actions pipeline (`.github/workflows/gh-pages-cd.yml`) builds and deploys to GitHub Pages on push to `main`

## Maintenance

- Keep `README.md` and `CLAUDE.md` up-to-date when making changes to the project structure, tech stack, commands, or architecture
