# MarketWave Frontend - Complete Documentation

## Overview
A production-ready, full-featured vehicle marketplace frontend application built with modern web technologies and industry best practices.

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (100% type-safe)
- **Styling**: Tailwind CSS 4
- **State Management**: 
  - TanStack Query (React Query) for server state
  - Zustand for client state
- **Form Management**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Notifications**: Sonner

## Directory Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard pages
│   │   ├── page.tsx             # Admin home
│   │   ├── brands/page.tsx      # Brand management
│   │   └── models/page.tsx      # Model management
│   ├── stores/                   # Store/dealership pages
│   │   ├── page.tsx             # Store listing
│   │   ├── create/page.tsx      # Create store
│   │   └── [id]/page.tsx        # Store details
│   ├── vehicles/                 # Vehicle marketplace pages
│   │   ├── page.tsx             # Vehicle listing
│   │   ├── create/page.tsx      # Create ad
│   │   └── [id]/page.tsx        # Vehicle details
│   ├── layout.tsx               # Root layout (navigation + footer)
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── layout/                  # Layout components
│   │   ├── navigation.tsx       # Main navigation
│   │   └── footer.tsx           # Footer
│   ├── store/                   # Store components
│   │   ├── store-card.tsx       # Store card component
│   │   └── store-form.tsx       # Store form
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx           # Button component
│   │   ├── input.tsx            # Input component
│   │   ├── card.tsx             # Card component
│   │   ├── modal.tsx            # Modal dialog
│   │   ├── loading.tsx          # Loading states
│   │   ├── error-state.tsx      # Error state
│   │   ├── empty-state.tsx      # Empty state
│   │   └── ...                  # Other UI components
│   └── vehicle/                 # Vehicle components
│       ├── vehicle-card.tsx     # Vehicle card
│       ├── vehicle-filters.tsx  # Filter sidebar
│       └── vehicle-ad-form.tsx  # Vehicle form
│
├── lib/                         # Core utilities and configs
│   ├── api/                     # API layer
│   │   ├── client.ts            # Axios instance
│   │   ├── vehicle-ads.ts       # Vehicle API
│   │   ├── stores.ts            # Store API
│   │   ├── brands.ts            # Brand/Model API
│   │   ├── categories.ts        # Category/BodyType API
│   │   └── index.ts             # API exports
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-vehicle-ads.ts   # Vehicle hooks
│   │   ├── use-stores.ts        # Store hooks
│   │   ├── use-brands.ts        # Brand/Model hooks
│   │   └── use-categories.ts    # Category hooks
│   ├── providers/               # React context providers
│   │   └── query-provider.tsx   # React Query provider
│   ├── store/                   # Zustand stores
│   │   └── auth-store.ts        # Auth state
│   ├── types/                   # TypeScript types
│   │   └── index.ts             # All type definitions
│   └── utils/                   # Utility functions
│       ├── cn.ts                # Class name utility
│       └── format.ts            # Formatting utilities
│
└── public/                      # Static assets

```

## Key Features

### 1. Vehicle Marketplace
**Location**: `/app/vehicles/`

**Features**:
- Browse all vehicles with pagination
- Advanced filtering (price, year, fuel, transmission, condition)
- Search by title
- Create new vehicle ads
- View detailed vehicle information
- Edit and delete vehicles
- Status management (Active, Sold, Pending)

**Components**:
- `VehicleCard`: Displays vehicle summary
- `VehicleFilters`: Filter sidebar
- `VehicleAdForm`: Create/edit form with validation

### 2. Store/Dealership Management
**Location**: `/app/stores/`

**Features**:
- Browse all registered dealerships
- View store details and inventory
- Create and register new stores
- Edit store information
- Auto-generate slugs from store names
- Location management (country, city, address)

**Components**:
- `StoreCard`: Store summary card
- `StoreForm`: Store registration form

### 3. Admin Panel
**Location**: `/app/admin/`

**Features**:
- Manage vehicle brands
- Manage vehicle models (linked to brands)
- Manage body types
- Manage ad categories
- Dashboard overview

**Architecture**: Modal-based CRUD operations for quick management

### 4. Homepage
**Location**: `/app/page.tsx`

**Features**:
- Hero section with CTAs
- Feature highlights
- Featured vehicles showcase
- Dealership registration CTA

## API Integration

### API Client Configuration
**File**: `lib/api/client.ts`

**Features**:
- Axios instance with base URL
- Request interceptor for auth tokens
- Response interceptor for error handling
- 401 redirect to login
- 30-second timeout

### API Modules

#### Vehicle Ads API (`lib/api/vehicle-ads.ts`)
```typescript
- getAll(): Get all vehicles
- getById(id): Get single vehicle
- getByOwner(ownerId): Get owner's vehicles
- getByStore(storeId): Get store's vehicles
- searchByTitle(query): Search vehicles
- filterByPrice(min, max): Filter by price range
- create(data): Create new ad
- update(id, data): Update ad
- delete(id): Delete ad
```

#### Stores API (`lib/api/stores.ts`)
```typescript
- getAll(): Get all stores
- getById(id): Get single store
- getBySlug(slug): Get store by slug
- getByOwner(ownerId): Get owner's stores
- searchByName(query): Search stores
- create(data): Create new store
- update(id, data): Update store
- delete(id): Delete store
```

#### Brands API (`lib/api/brands.ts`)
```typescript
Brands:
- getAll(), getById(id), create(), update(), delete()

Models:
- getAll(), getById(id), getByBrand(brandId), create(), update(), delete()
```

#### Categories API (`lib/api/categories.ts`)
```typescript
Categories:
- getAll(), getById(id), create(), update(), delete()

Body Types:
- getAll(), getById(id), create(), update(), delete()
```

## State Management

### Server State (React Query)
**Provider**: `lib/providers/query-provider.tsx`

**Configuration**:
- 1-minute stale time
- Automatic refetch disabled on window focus
- 1 retry on failure

**Custom Hooks**:
- `useVehicleAds()`: Fetch all vehicles
- `useVehicleAd(id)`: Fetch single vehicle
- `useCreateVehicleAd()`: Create mutation
- `useUpdateVehicleAd()`: Update mutation
- `useDeleteVehicleAd()`: Delete mutation
- Similar hooks for stores, brands, models, categories

### Client State (Zustand)
**Store**: `lib/store/auth-store.ts`

```typescript
interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  setUserId: (userId: string) => void;
  logout: () => void;
}
```

**Features**:
- Persisted to localStorage
- Auth token management

## Form Management

### Validation Schemas (Zod)
All forms use Zod for schema validation:

**Vehicle Ad Schema**:
```typescript
- title: min 10 chars
- description: min 20 chars
- brandId, modelId, bodyTypeId, categoryId: required
- year: 1900 to current year + 1
- mileage: min 0
- fuelType, transmission, condition: required
- price: min 0
- country, city: required
```

**Store Schema**:
```typescript
- name: min 3 chars
- slug: min 3 chars, lowercase alphanumeric + hyphens
- country, city: required
- status: ACTIVE or INACTIVE
```

### Form Handling
**Library**: React Hook Form

**Features**:
- Client-side validation
- Error messaging
- Loading states
- Success/error notifications (Sonner)
- Automatic slug generation (stores)
- Dependent dropdowns (brand -> models)

## UI Component Library

### Core Components

#### Button (`components/ui/button.tsx`)
**Variants**: default, outline, ghost, destructive, link
**Sizes**: default, sm, lg, icon

#### Input (`components/ui/input.tsx`)
**Features**: Focus ring, disabled state, error state

#### Card (`components/ui/card.tsx`)
**Sub-components**: CardHeader, CardTitle, CardDescription, CardContent, CardFooter

#### Modal (`components/ui/modal.tsx`)
**Features**:
- Backdrop blur
- Close on ESC
- Close button
- Sizes: sm, md, lg, xl
- Body scroll lock

#### Loading (`components/ui/loading.tsx`)
**Components**: 
- `Loading`: Spinner with optional text
- `LoadingPage`: Full-page loading state

#### ErrorState (`components/ui/error-state.tsx`)
**Features**: Error icon, message, retry button

#### EmptyState (`components/ui/empty-state.tsx`)
**Features**: Empty icon, title, description, action button

#### SearchInput (`components/ui/search-input.tsx`)
**Features**: Search icon, clear button, real-time search

### Utility Functions

#### Class Names (`lib/utils/cn.ts`)
```typescript
cn(...inputs): string
// Merges Tailwind classes using clsx and tailwind-merge
```

#### Formatting (`lib/utils/format.ts`)
```typescript
formatCurrency(amount, currency): string
formatNumber(num): string
formatDate(date, format): string
slugify(text): string
```

## Responsive Design

### Breakpoints (Tailwind)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Mobile-First Approach
- All layouts start with mobile design
- Progressive enhancement for larger screens
- Mobile navigation menu
- Touch-friendly UI elements
- Responsive grids (1 col → 2 cols → 3 cols → 4 cols)

## Navigation Structure

### Main Navigation
**Component**: `components/layout/navigation.tsx`

**Links**:
- Home (/)
- Vehicles (/vehicles)
- Dealerships (/stores)
- Admin (/admin)

**Features**:
- Active link highlighting
- Mobile hamburger menu
- Sticky header
- Logo with brand

### Footer
**Component**: `components/layout/footer.tsx`

**Sections**:
- Brand logo and tagline
- Quick links
- Support links
- Social media links

## Error Handling

### API Errors
- Axios interceptors catch all errors
- 401 → Redirect to login
- Other errors → Display error message

### Component Errors
- Error boundaries for route-level errors
- `ErrorState` component for data fetching errors
- Toast notifications for mutations

### Loading States
- Skeleton screens during data fetch
- Button loading states during mutations
- Page-level loading for route changes

## Performance Optimizations

1. **Code Splitting**: Automatic with Next.js App Router
2. **Image Optimization**: Next.js Image component ready
3. **Data Caching**: React Query automatic caching
4. **Debounced Search**: Real-time search with debouncing
5. **Lazy Loading**: Components loaded on demand
6. **Memoization**: React hooks for expensive computations

## SEO & Accessibility

### SEO
- Metadata API for all pages
- Semantic HTML structure
- Dynamic meta tags
- OpenGraph ready

### Accessibility
- Semantic HTML elements
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

## Environment Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

**Note**: All public variables must be prefixed with `NEXT_PUBLIC_`

## Development Workflow

### Getting Started
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Code Quality
```bash
npm run lint
```

## Best Practices Implemented

✅ **TypeScript Strict Mode**: All code is type-safe
✅ **Component Composition**: Reusable, composable UI
✅ **Separation of Concerns**: Clear separation of logic
✅ **DRY Principle**: No code duplication
✅ **Error Handling**: Comprehensive error management
✅ **Loading States**: Feedback for all async operations
✅ **Form Validation**: Client-side validation
✅ **Responsive Design**: Mobile-first approach
✅ **Accessibility**: WCAG compliance ready
✅ **Performance**: Optimized bundle size
✅ **SEO**: Search engine friendly
✅ **Code Organization**: Clear folder structure

## Future Enhancements

### Potential Improvements
1. **Authentication**: Complete auth flow with JWT
2. **Image Upload**: Cloudinary/S3 integration
3. **Favorites**: Save favorite vehicles
4. **Chat**: Real-time messaging between buyers/sellers
5. **Analytics**: Google Analytics integration
6. **PWA**: Progressive Web App features
7. **Dark Mode**: Theme switching
8. **Multi-language**: i18n support
9. **Advanced Filters**: Map view, saved searches
10. **Payment**: Stripe integration for premium listings

## Troubleshooting

### Common Issues

**API Connection Failed**
- Ensure backend is running on localhost:8080
- Check .env.local has correct API URL

**Build Errors**
- Clear .next folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**TypeScript Errors**
- Check all imports are correct
- Ensure all required props are passed

## Support

For issues or questions:
1. Check the documentation
2. Review error logs
3. Check browser console
4. Verify API is running

## License

MIT License - See LICENSE file for details
