# Angular 21 Portfolio - Setup Guide

This project is an Angular 21 portfolio application with **Biome** configured as a unified formatter and linter (similar to oxfmt + oxlint for Rust).

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

## Code Quality Tools

### Biome - Unified Formatter & Linter

This project uses **Biome** for both code formatting and linting. It's configured in `biome.json` with sensible defaults for Angular/TypeScript projects.

#### Available Commands

```bash
# Check formatting and linting
npm run lint        # Check for linting errors
npm run lint:fix    # Auto-fix linting errors

npm run format      # Check formatting
npm run format:fix  # Auto-format all files

npm run check       # Run both lint and format checks
npm run check:fix   # Fix all issues
```

#### Configuration

- **Config file**: `biome.json`
- **Ignore patterns**: `.biomeignore`

Key settings:
- 2-space indentation
- 100 character line width
- Always use semicolons
- Double quotes for strings
- ESLint-compatible linting rules

#### Common Linting Issues

1. **Import types**: Use `import type` for type-only imports
   ```ts
   // ❌ Before
   import { SomeType } from "@angular/core";

   // ✅ After
   import type { SomeType } from "@angular/core";
   ```

2. **Accessibility (a11y)**: SVGs and ARIA roles need proper attributes
   - Add `title` element to SVGs or `aria-label`
   - Add required ARIA attributes for roles

3. **HTML templates**: Angular interpolations are flagged as text expressions (ignore these for now)

## Project Structure

```
src/
├── app/
│   ├── app.ts          # Root component
│   ├── app.html        # Component template
│   ├── app.scss        # Component styles
│   ├── app.config.ts   # Application configuration
│   ├── app.routes.ts   # Route definitions
│   └── app.spec.ts     # Component tests
├── main.ts             # Application entry point
├── styles.scss         # Global styles
└── index.html          # HTML entry file
angular.json            # Angular CLI configuration
tsconfig.json           # TypeScript configuration
```

## Testing

```bash
npm run test           # Run tests with Vitest
```

## Pre-commit Workflow

Before committing, run:
```bash
npm run check:fix      # Fix all formatting and linting issues
npm run build          # Ensure build succeeds
npm run test           # Verify tests pass
```

Or set up a Git pre-commit hook to automate this.

## Troubleshooting

**Biome reports "text expressions aren't supported"**
- This is expected for Angular `{{ }}` template interpolations. These warnings can be safely ignored.

**Port 4200 already in use**
```bash
npm start -- --port 4300
```

**Need to rebuild node_modules**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Resources

- [Angular Documentation](https://angular.io)
- [Biome Documentation](https://biomejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
