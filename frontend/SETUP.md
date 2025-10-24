# Next.js + Tailwind CSS Project

This project was created using Next.js 15.5.6 with Tailwind CSS v4 and TypeScript.

## Getting Started

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Linting

Check code quality:

```bash
npm run lint
```

## Project Structure

- `src/app/` - App Router pages and layouts
  - `page.tsx` - Home page component
  - `layout.tsx` - Root layout with metadata
  - `globals.css` - Global styles with Tailwind CSS
- `public/` - Static assets (images, SVGs)
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind
- `eslint.config.mjs` - ESLint configuration

## Technologies

- **React 19.1.0** - UI library
- **Next.js 15.5.6** - React framework with App Router
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Turbopack** - Fast bundler for development and builds

## Features

- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG)
- ✅ TypeScript support
- ✅ Tailwind CSS v4 with PostCSS
- ✅ ESLint configuration
- ✅ Path aliases (@/*)
- ✅ Hot module replacement
- ✅ Optimized for production

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
