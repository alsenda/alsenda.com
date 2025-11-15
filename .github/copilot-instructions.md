# Alsenda Portfolio - Copilot Instructions

This Next.js portfolio project serves as a central hub for multiple web applications running on different subdomains.

## Project Overview

- **Project Type**: Next.js Application
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Turbopack
- **Architecture**: Subdomain-based application routing

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main portfolio landing page
│   ├── layout.tsx            # Root layout with global styles
│   ├── globals.css           # Global styles
│   └── apps/                 # Application routes
│       ├── app1/page.tsx     # App 1 (served on app1.* subdomain)
│       ├── app2/page.tsx     # App 2 (served on app2.* subdomain)
│       └── app3/page.tsx     # App 3 (served on app3.* subdomain)
├── middleware.ts             # Subdomain routing middleware
├── public/                   # Static assets
└── lib/                      # Utility functions (add as needed)
```

## Key Features

1. **Main Portfolio Page** (`src/app/page.tsx`)
   - Landing page with navigation
   - Application showcase cards
   - About and contact sections
   - Responsive dark theme

2. **Subdomain Routing** (`src/middleware.ts`)
   - Extracts subdomain from request hostname
   - Routes subdomain traffic to `/apps/{subdomain}` internally
   - Serves main portfolio for root domain
   - Currently supports: app1, app2, app3

3. **Application Pages**
   - Each app has its own unique design and color scheme
   - Back-to-portfolio link for navigation
   - Placeholder feature cards for customization

## Adding New Applications

To add a new application (e.g., "blog"):

1. Create directory: `src/app/apps/blog/`
2. Create page file: `src/app/apps/blog/page.tsx`
3. Update `src/middleware.ts`: Add "blog" to `appSubdomains` array
4. Update `src/app/page.tsx`: Add application card to the applications array

## Running the Application

### Development
```bash
npm run dev
```
Access at `http://localhost:3000`

### Testing Subdomains Locally
Add to your hosts file:
- Windows: `C:\Windows\System32\drivers\etc\hosts`
- Mac/Linux: `/etc/hosts`

```
127.0.0.1 alsenda.local
127.0.0.1 app1.alsenda.local
127.0.0.1 app2.alsenda.local
127.0.0.1 app3.alsenda.local
```

Then access:
- `http://alsenda.local:3000` - Main portfolio
- `http://app1.alsenda.local:3000` - Application 1
- `http://app2.alsenda.local:3000` - Application 2
- `http://app3.alsenda.local:3000` - Application 3

### Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Configuration

- **TypeScript**: `tsconfig.json`
- **Next.js**: `next.config.ts`
- **Tailwind**: `tailwind.config.ts`
- **PostCSS**: `postcss.config.mjs`
- **ESLint**: `eslint.config.mjs`

## Build Status

✅ Latest build successful
- All pages compile without errors
- TypeScript type checking passes
- Static pages: 4 (main page + 3 app pages)
- Middleware: Proxy for subdomain routing

## Next Steps for Customization

1. **Portfolio Content**: Update main page with your information
2. **Application Content**: Replace app1, app2, app3 with real applications
3. **Branding**: Update colors, fonts, and company name
4. **Domain Setup**: Configure DNS for your domain
5. **Deployment**: Deploy to Vercel, Docker, or your preferred hosting

## Dependencies

- next@16.0.3
- react@19
- typescript@5
- tailwindcss@3.4
- eslint

Install all dependencies:
```bash
npm install
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Notes

- The project uses the Next.js App Router (not Pages Router)
- Middleware.ts handles subdomain routing (uses "proxy" pattern)
- All components are server components by default
- Tailwind CSS is used for styling (no CSS modules unless needed)
- The project is configured for 16x16 image optimization
