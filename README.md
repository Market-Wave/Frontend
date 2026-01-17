# MarketWave Frontend

A modern, full-featured vehicle marketplace frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🚗 **Vehicle Marketplace**: Browse, search, and filter vehicles
- 🏪 **Dealership Management**: Manage stores and their inventories
- 📝 **Ad Creation**: Create and edit vehicle advertisements
- 🔍 **Advanced Search**: Filter by price, year, fuel type, transmission, and more
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Real-time Updates**: Using React Query for efficient data fetching
- 🎨 **Modern UI**: Clean and intuitive user interface with Tailwind CSS
- 🔒 **Type Safety**: Full TypeScript support for better development experience
- ✅ **Form Validation**: Client-side validation with Zod and React Hook Form

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand + React Query
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Backend API running on http://localhost:8080

### Installation

1. Install dependencies
```bash
npm install
```

2. Create environment file
```bash
cp .env.local.example .env.local
```

3. Update the `.env.local` file with your backend API URL
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/                      # Next.js app directory (routes)
│   ├── admin/               # Admin pages (brands, models, etc.)
│   ├── stores/              # Store pages
│   ├── vehicles/            # Vehicle pages
│   ├── layout.tsx           # Root layout with navigation
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── layout/              # Layout components (nav, footer)
│   ├── store/               # Store-related components
│   ├── ui/                  # Reusable UI components
│   └── vehicle/             # Vehicle-related components
├── lib/                     # Utilities and configurations
│   ├── api/                 # API client and endpoints
│   ├── hooks/               # Custom React hooks
│   ├── providers/           # React context providers
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
└── public/                  # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Features Implementation

### API Integration
All API calls are centralized in `lib/api/` with typed responses and error handling.

### State Management
- **React Query**: Server state management for caching and synchronization
- **Zustand**: Client state management (auth, UI state)

### Form Validation
Forms use React Hook Form with Zod schemas for robust validation:
- Vehicle ad creation/editing
- Store registration
- Admin data management

### Responsive Design
Mobile-first approach with Tailwind CSS breakpoints:
- Mobile menu for small screens
- Grid layouts that adapt to screen size
- Touch-friendly UI elements

## Best Practices Implemented

✅ **TypeScript**: Full type safety across the application
✅ **Component Composition**: Reusable, composable components
✅ **Code Splitting**: Automatic with Next.js App Router
✅ **SEO Friendly**: Metadata API for better search engine optimization
✅ **Accessibility**: Semantic HTML and ARIA attributes
✅ **Error Handling**: Comprehensive error boundaries and states
✅ **Loading States**: Skeleton screens and loading indicators
✅ **Data Caching**: Efficient data fetching with React Query
✅ **Form Validation**: Client-side validation before API calls
✅ **Toast Notifications**: User feedback for all actions

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080/api/v1` |

## License

MIT License


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
