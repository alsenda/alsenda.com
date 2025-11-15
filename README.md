# Alsenda Portfolio

A modern Next.js portfolio application that serves as a central hub for multiple web applications running on different subdomains.

## Overview

Alsenda is a portfolio project built with Next.js 14+, TypeScript, and Tailwind CSS. It features:

- **Main Portfolio**: A landing page showcasing your applications and skills
- **Subdomain Routing**: Each application runs on its own subdomain (app1, app2, app3, etc.)
- **Responsive Design**: Mobile-friendly layout with dark mode support
- **Easy Customization**: Well-structured components for adding new applications

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main portfolio landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── apps/                 # Application routes
│       ├── app1/page.tsx     # App 1 (app1.alsenda.local)
│       ├── app2/page.tsx     # App 2 (app2.alsenda.local)
│       └── app3/page.tsx     # App 3 (app3.alsenda.local)
├── middleware.ts             # Subdomain routing middleware
└── lib/                      # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the main portfolio.

### Testing Subdomains Locally

To test subdomain routing locally, add these entries to your hosts file:

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux**: `/etc/hosts`

```
127.0.0.1 alsenda.local
127.0.0.1 app1.alsenda.local
127.0.0.1 app2.alsenda.local
127.0.0.1 app3.alsenda.local
```

Then visit:
- `http://alsenda.local:3000` - Main portfolio
- `http://app1.alsenda.local:3000` - Application 1
- `http://app2.alsenda.local:3000` - Application 2
- `http://app3.alsenda.local:3000` - Application 3

### Production Build

```bash
npm run build
npm start
```

## Subdomain Routing

The `middleware.ts` file handles subdomain routing by:

1. Extracting the subdomain from the request hostname
2. Routing subdomain traffic to `/apps/{subdomain}` internally
3. Serving the main portfolio for the root domain

To add a new application:

1. Create a new directory in `src/app/apps/{appname}`
2. Add a `page.tsx` file with your application content
3. Update `middleware.ts` to include the new subdomain in the `appSubdomains` array
4. Add the application card to the portfolio main page

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: ESLint
- **Build Tool**: Turbopack

## Configuration Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `.eslintrc.js` - ESLint configuration

## Deployment

This project can be deployed to:

- **Vercel** (recommended for Next.js): Push to GitHub and connect via Vercel Dashboard
- **Docker**: Create a Dockerfile for containerized deployment
- **Traditional Hosting**: Build and deploy the `.next` folder to any Node.js hosting

### Vercel Deployment

```bash
npm install -g vercel
vercel
```

### Custom Domain

To use a custom domain (e.g., portfolio.com):

1. Configure DNS records to point to your hosting
2. Update the subdomain URLs to use your custom domain
3. Configure SSL certificates for all subdomains

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Contributing

Feel free to modify and extend this project for your needs.

## License

MIT

---

**Made with Next.js** | Portfolio Template
