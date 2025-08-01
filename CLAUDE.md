# OwnTube.tv Website Development Guidelines

## Commands

- `npm run dev` - Start development server (runs on port 8080)
- `npm run build` - Build for production (includes static route generation)
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

## Code Style

- **TypeScript**: Use TypeScript for type safety (strict mode disabled)
- **Imports**: Use path aliases with `@/*` for src directory imports
- **Formatting**:
  - Double quotes, 2 space indentation, 120 char line limit
  - Semicolons required, trailing commas for ES5
- **Components**: Follow React functional component patterns with hooks
- **UI Components**: Use shadcn/ui component library with Tailwind
- **State Management**: Use React hooks for local state, React Query for remote
- **Error Handling**: Use try/catch blocks for async operations
- **Forms**: Use react-hook-form with zod validation

## Project Structure

- React/TypeScript/Vite application with SWC
- Tailwind CSS for styling with shadcn/ui components
- Static site generation for `/contact` and `/consulting` routes
- Components in src/components (including full shadcn/ui library)
- Pages in src/pages
- Hooks in src/hooks
- Utility functions in src/lib
- Development server runs on port 8080 with IPv6 support

## Architecture Notes

- **Static Generation**: Uses `generate-static-routes.mjs` for SSG
- **Path Aliases**: `@/*` maps to `src/*` directory
- **TypeScript Config**: Strict mode disabled, allows JS files
- **Build Process**: Includes GPT Engineer script removal in production
