# MarketWave

A multi-country online vehicle marketplace where individual sellers and dealers can publish vehicle advertisements, run their own branded store pages, and connect with buyers through search, chat, and preorder requests. The platform supports location-based discovery (country/city + map coordinates) and optional AI-powered semantic (vector) search to help buyers find the right vehicles even when they search with natural language.

Sellers can create and manage vehicle listings with structured details (brand, model, year, price, condition) and rich media galleries (front/back/left/right + interior angles + extra photos). Dealer "Store pages" act like mini websites inside the platform, with customizable branding (logo, banner, favicon, thumbnail) and full theme/page-builder configuration (colors, buttons, sections, custom CSS/JS), plus a store gallery and a dedicated listing feed.

Buyers can like/save ads, send messages to sellers in real-time chat, and submit preorder requests on specific ads. The system includes order request matching (buyers post what they want; matching listings are suggested/alerted), seller bidding events (optional), personal "My Garage" for tracking owned vehicles and estimating value, and a blog module for vehicle reviews and content marketing.

Monetization is built in: users can post a limited number of free ads, then purchase extra ad slots or seller upgrades through PayHere payments. The backend is designed for Spring Boot + PostgreSQL with event-driven expansion (Kafka-ready) and cloud-friendly deployment (Kubernetes + S3 media storage), so it can start as an MVP and scale into a production marketplace.

---

## Tech Stack

- **Frontend:** React (TypeScript recommended) for SPA pages (home/search, ad details, store pages, dashboards) and WebSocket client for chat.
- **Backend:** Spring Boot (Java) REST APIs; start as a modular monolith, then split into microservices if needed; Kafka-ready for event-driven communication.
- **Database:** PostgreSQL for all relational data (users, stores, ads, chat, payments), plus **pgvector** extension for AI vector similarity search on vehicle ads.
- **Messaging/Event bus:** Apache Kafka for async events (ad created/updated, notifications, payment success, search indexing).
- **File storage:** Amazon S3 (or S3-compatible) for vehicle/store images using **pre-signed URLs** (client uploads directly, backend only generates the signed URL).
- **Infrastructure/Deployment:** Docker containers + Kubernetes (K8s) for scaling services, with an API Gateway/Ingress as the single entry point.

---

## DB Schema

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  country VARCHAR(2),
  address VARCHAR(255),
  city VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  language VARCHAR(10),
  currency VARCHAR(10),
  dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
  email_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  type VARCHAR(30) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  country VARCHAR(2) NOT NULL,
  city VARCHAR(100),
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  address VARCHAR(255),
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stores_country_city ON stores(country, city);

CREATE TABLE store_page_configs (
  store_id UUID PRIMARY KEY REFERENCES stores(id) ON DELETE CASCADE,
  favicon_url TEXT,
  logo_url TEXT,
  banner_url TEXT,
  thumbnail_url TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  theme_name VARCHAR(100),
  theme_version VARCHAR(50),
  colors JSONB NOT NULL DEFAULT '{}'::jsonb,
  buttons JSONB NOT NULL DEFAULT '{}'::jsonb,
  typography JSONB NOT NULL DEFAULT '{}'::jsonb,
  layout JSONB NOT NULL DEFAULT '{}'::jsonb,
  pages JSONB NOT NULL DEFAULT '{}'::jsonb,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_css TEXT,
  custom_js TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE store_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type VARCHAR(30) NOT NULL,
  media_view VARCHAR(50) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_store_media_view
  CHECK (media_view IN (
    'favicon','logo','banner','thumbnail',
    'gallery-1','gallery-2','gallery-3','gallery-4','gallery-5',
    'extra-1','extra-2','extra-3','extra-4','extra-5'
  ))
);

CREATE INDEX idx_store_media_store_sort ON store_media(store_id, sort_order);

CREATE TABLE vehicle_brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE vehicle_models (
  id SERIAL PRIMARY KEY,
  brand_id INT NOT NULL REFERENCES vehicle_brands(id),
  name VARCHAR(100) NOT NULL,
  UNIQUE (brand_id, name)
);

CREATE TABLE body_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE ad_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE vehicle_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  brand_id INT NOT NULL REFERENCES vehicle_brands(id),
  model_id INT NOT NULL REFERENCES vehicle_models(id),
  body_type_id INT REFERENCES body_types(id),
  category_id INT REFERENCES ad_categories(id),
  year INT NOT NULL,
  mileage INT,
  fuel_type VARCHAR(30),
  transmission VARCHAR(30),
  condition VARCHAR(30),
  price NUMERIC(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  country VARCHAR(2) NOT NULL,
  city VARCHAR(100),
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  address VARCHAR(255),
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  is_bidding_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  is_preorder_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_ads_country_city ON vehicle_ads(country, city);
CREATE INDEX idx_vehicle_ads_location ON vehicle_ads(latitude, longitude);
CREATE INDEX idx_vehicle_ads_brand_model ON vehicle_ads(brand_id, model_id);
CREATE INDEX idx_vehicle_ads_price ON vehicle_ads(price);
CREATE INDEX idx_vehicle_ads_store_id ON vehicle_ads(store_id);

CREATE TABLE vehicle_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES vehicle_ads(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type VARCHAR(30) NOT NULL,
  media_view VARCHAR(50) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT chk_vehicle_media_view
  CHECK (media_view IN (
    'front','back','left','right',
    'interior-front','interior-back','interior-left','interior-right',
    'interior-top','interior-bottom',
    'extra-1','extra-2','extra-3','extra-4','extra-5'
  ))
);

CREATE INDEX idx_vehicle_media_ad_sort ON vehicle_media(ad_id, sort_order);

CREATE TABLE vehicle_ad_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES vehicle_ads(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, ad_id)
);

CREATE INDEX idx_vehicle_ad_likes_ad_created_at ON vehicle_ad_likes(ad_id, created_at DESC);
CREATE INDEX idx_vehicle_ad_likes_user_created_at ON vehicle_ad_likes(user_id, created_at DESC);

CREATE TABLE user_ad_quota (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  free_ads_limit INT NOT NULL DEFAULT 3,
  free_ads_used INT NOT NULL DEFAULT 0,
  UNIQUE (user_id, period_start, period_end)
);

CREATE TABLE pricing_rules (
  id SERIAL PRIMARY KEY,
  country VARCHAR(2) NOT NULL,
  category_id INT NOT NULL REFERENCES ad_categories(id),
  month DATE NOT NULL,
  base_price NUMERIC(15,2) NOT NULL,
  extra_ad_price NUMERIC(15,2) NOT NULL,
  store_subscription_price NUMERIC(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  UNIQUE (country, category_id, month)
);

CREATE TABLE order_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES ad_categories(id),
  brand_id INT REFERENCES vehicle_brands(id),
  model_id INT REFERENCES vehicle_models(id),
  year_min INT,
  year_max INT,
  budget_min NUMERIC(15,2),
  budget_max NUMERIC(15,2),
  currency VARCHAR(10),
  country VARCHAR(2),
  city VARCHAR(100),
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_request_id UUID NOT NULL REFERENCES order_requests(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES vehicle_ads(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  notified BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (order_request_id, ad_id)
);

CREATE TABLE bidding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL UNIQUE REFERENCES vehicle_ads(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_price NUMERIC(15,2) NOT NULL,
  reserve_price NUMERIC(15,2),
  min_increment NUMERIC(15,2) NOT NULL DEFAULT 100.00,
  currency VARCHAR(10) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES bidding_events(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bids_event_created_at ON bids(event_id, created_at DESC);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID REFERENCES vehicle_ads(id) ON DELETE SET NULL,
  order_request_id UUID REFERENCES order_requests(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_read BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_messages_conversation_created_at ON messages(conversation_id, created_at);

CREATE TABLE garage_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id INT REFERENCES vehicle_brands(id),
  model_id INT REFERENCES vehicle_models(id),
  year INT,
  mileage INT,
  estimated_price NUMERIC(15,2),
  currency VARCHAR(10),
  last_estimated_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_garage_items_user ON garage_items(user_id);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE blog_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE blog_post_tags (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose VARCHAR(50) NOT NULL,
  reference_id UUID,
  amount NUMERIC(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  gateway VARCHAR(30) NOT NULL,
  gateway_payment_id VARCHAR(255),
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  raw_request JSONB,
  raw_response JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user_created_at ON payments(user_id, created_at DESC);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  message TEXT,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_created_at ON notifications(user_id, created_at DESC);

CREATE TABLE preorders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES vehicle_ads(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(200),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  message TEXT,
  budget_min NUMERIC(15,2),
  budget_max NUMERIC(15,2),
  currency VARCHAR(10),
  note TEXT,
  available_from DATE,
  deposit_amount NUMERIC(15,2),
  deposit_currency VARCHAR(10),
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_preorders_ad_created_at ON preorders(ad_id, created_at DESC);
CREATE INDEX idx_preorders_customer_created_at ON preorders(customer_id, created_at DESC);

CREATE TABLE preorder_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preorder_id UUID NOT NULL REFERENCES preorders(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_preorder_messages_preorder ON preorder_messages(preorder_id, created_at);

CREATE TABLE vehicle_ad_embeddings (
  ad_id UUID PRIMARY KEY REFERENCES vehicle_ads(id) ON DELETE CASCADE,
  embedding vector(1536) NOT NULL,
  country VARCHAR(2),
  city VARCHAR(100),
  category_id INT REFERENCES ad_categories(id),
  price NUMERIC(15,2),
  currency VARCHAR(10)
);

CREATE INDEX idx_vehicle_ad_embeddings_vector
ON vehicle_ad_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX idx_vehicle_ad_embeddings_filters
ON vehicle_ad_embeddings(country, city, category_id, price);

ANALYZE vehicle_ad_embeddings;
```

---

## ER Diagram

### users
| Column | Type |
|--------|------|
| id | UUID |
| email | VARCHAR(255) |
| password_hash | VARCHAR(255) |
| role | VARCHAR(30) |
| status | VARCHAR(30) |
| first_name | VARCHAR(100) |
| last_name | VARCHAR(100) |
| phone | VARCHAR(50) |
| country | VARCHAR(2) |
| address | VARCHAR(255) |
| city | VARCHAR(100) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### user_settings
| Column | Type |
|--------|------|
| user_id | UUID |
| language | VARCHAR(10) |
| currency | VARCHAR(10) |
| dark_mode | BOOLEAN |
| email_notifications_enabled | BOOLEAN |

### user_tokens
| Column | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| token | TEXT |
| type | VARCHAR(30) |
| expires_at | TIMESTAMP |
| created_at | TIMESTAMP |

### stores
| Column | Type |
|--------|------|
| id | UUID |
| owner_id | UUID |
| name | VARCHAR(255) |
| slug | VARCHAR(255) |
| description | TEXT |
| country | VARCHAR(2) |
| city | VARCHAR(100) |
| latitude | NUMERIC(10,6) |
| longitude | NUMERIC(10,6) |
| address | VARCHAR(255) |
| status | VARCHAR(30) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### store_page_configs
| Column | Type |
|--------|------|
| store_id | UUID |
| favicon_url | TEXT |
| logo_url | TEXT |
| banner_url | TEXT |
| thumbnail_url | TEXT |
| meta_title | VARCHAR(255) |
| meta_description | TEXT |
| theme_name | VARCHAR(100) |
| theme_version | VARCHAR(50) |
| colors | JSONB |
| buttons | JSONB |
| typography | JSONB |
| layout | JSONB |
| pages | JSONB |
| sections | JSONB |
| custom_css | TEXT |
| custom_js | TEXT |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### store_media
| Column | Type |
|--------|------|
| id | UUID |
| store_id | UUID |
| url | TEXT |
| media_type | VARCHAR(30) |
| media_view | VARCHAR(50) |
| sort_order | INT |
| created_at | TIMESTAMP |

### vehicle_brands
| Column | Type |
|--------|------|
| id | SERIAL |
| name | VARCHAR(100) |

### vehicle_models
| Column | Type |
|--------|------|
| id | SERIAL |
| brand_id | INT |
| name | VARCHAR(100) |

### body_types
| Column | Type |
|--------|------|
| id | SERIAL |
| name | VARCHAR(100) |

### ad_categories
| Column | Type |
|--------|------|
| id | SERIAL |
| name | VARCHAR(100) |

### vehicle_ads
| Column | Type |
|--------|------|
| id | UUID |
| owner_id | UUID |
| store_id | UUID |
| title | VARCHAR(255) |
| description | TEXT |
| brand_id | INT |
| model_id | INT |
| body_type_id | INT |
| category_id | INT |
| year | INT |
| mileage | INT |
| fuel_type | VARCHAR(30) |
| transmission | VARCHAR(30) |
| condition | VARCHAR(30) |
| price | NUMERIC(15,2) |
| currency | VARCHAR(10) |
| country | VARCHAR(2) |
| city | VARCHAR(100) |
| latitude | NUMERIC(10,6) |
| longitude | NUMERIC(10,6) |
| address | VARCHAR(255) |
| status | VARCHAR(30) |
| is_bidding_enabled | BOOLEAN |
| is_preorder_enabled | BOOLEAN |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### vehicle_media
| Column | Type |
|--------|------|
| id | UUID |
| ad_id | UUID |
| url | TEXT |
| media_type | VARCHAR(30) |
| media_view | VARCHAR(50) |
| sort_order | INT |

### vehicle_ad_likes
| Column | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| ad_id | UUID |
| created_at | TIMESTAMP |

### user_ad_quota
| Column | Type |
|--------|------|
| id | SERIAL |
| user_id | UUID |
| period_start | DATE |
| period_end | DATE |
| free_ads_limit | INT |
| free_ads_used | INT |

### pricing_rules
| Column | Type |
|--------|------|
| id | SERIAL |
| country | VARCHAR(2) |
| category_id | INT |
| month | DATE |
| base_price | NUMERIC(15,2) |
| extra_ad_price | NUMERIC(15,2) |
| store_subscription_price | NUMERIC(15,2) |
| currency | VARCHAR(10) |

### order_requests
| Column | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| category_id | INT |
| brand_id | INT |
| model_id | INT |
| year_min | INT |
| year_max | INT |
| budget_min | NUMERIC(15,2) |
| budget_max | NUMERIC(15,2) |
| currency | VARCHAR(10) |
| country | VARCHAR(2) |
| city | VARCHAR(100) |
| latitude | NUMERIC(10,6) |
| longitude | NUMERIC(10,6) |
| status | VARCHAR(30) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### order_matches
| Column | Type |
|--------|------|
| id | UUID |
| order_request_id | UUID |
| ad_id | UUID |
| created_at | TIMESTAMP |
| notified | BOOLEAN |

### bidding_events
| Column | Type |
|--------|------|
| id | UUID |
| ad_id | UUID |
| seller_id | UUID |
| start_price | NUMERIC(15,2) |
| reserve_price | NUMERIC(15,2) |
| min_increment | NUMERIC(15,2) |
| currency | VARCHAR(10) |
| start_time | TIMESTAMP |
| end_time | TIMESTAMP |
| status | VARCHAR(30) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### bids
| Column | Type |
|--------|------|
| id | UUID |
| event_id | UUID |
| bidder_id | UUID |
| amount | NUMERIC(15,2) |
| created_at | TIMESTAMP |

### conversations
| Column | Type |
|--------|------|
| id | UUID |
| ad_id | UUID |
| order_request_id | UUID |
| buyer_id | UUID |
| seller_id | UUID |
| created_at | TIMESTAMP |

### messages
| Column | Type |
|--------|------|
| id | UUID |
| conversation_id | UUID |
| sender_id | UUID |
| content | TEXT |
| created_at | TIMESTAMP |
| is_read | BOOLEAN |

### garage_items
| Column | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| brand_id | INT |
| model_id | INT |
| year | INT |
| mileage | INT |
| estimated_price | NUMERIC(15,2) |
| currency | VARCHAR(10) |
| last_estimated_at | TIMESTAMP |
| created_at | TIMESTAMP |

### blog_posts
| Column | Type |
|--------|------|
| id | UUID |
| author_id | UUID |
| title | VARCHAR(255) |
| slug | VARCHAR(255) |
| content | TEXT |
| status | VARCHAR(30) |
| published_at | TIMESTAMP |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### blog_tags
| Column | Type |
|--------|------|
| id | SERIAL |
| name | VARCHAR(100) |

### blog_post_tags
| Column | Type |
|--------|------|
| post_id | UUID |
| tag_id | INT |

### payments
| Column | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| purpose | VARCHAR(50) |
| reference_id | UUID |
| amount | NUMERIC(15,2) |
| currency | VARCHAR(10) |
| gateway | VARCHAR(30) |
| gateway_payment_id | VARCHAR(255) |
| status | VARCHAR(30) |
| raw_request | JSONB |
| raw_response | JSONB |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### notifications
| Column | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| type | VARCHAR(50) |
| title | VARCHAR(255) |
| message | TEXT |
| data | JSONB |
| is_read | BOOLEAN |
| created_at | TIMESTAMP |

### preorders
| Column | Type |
|--------|------|
| id | UUID |
| ad_id | UUID |
| customer_id | UUID |
| customer_name | VARCHAR(200) |
| customer_email | VARCHAR(255) |
| customer_phone | VARCHAR(50) |
| message | TEXT |
| budget_min | NUMERIC(15,2) |
| budget_max | NUMERIC(15,2) |
| currency | VARCHAR(10) |
| note | TEXT |
| available_from | DATE |
| deposit_amount | NUMERIC(15,2) |
| deposit_currency | VARCHAR(10) |
| payment_id | UUID |
| status | VARCHAR(30) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### preorder_messages
| Column | Type |
|--------|------|
| id | UUID |
| preorder_id | UUID |
| sender_user_id | UUID |
| message | TEXT |
| created_at | TIMESTAMP |

### vehicle_ad_embeddings
| Column | Type |
|--------|------|
| ad_id | UUID |
| embedding | vector(1536) |
| country | VARCHAR(2) |
| city | VARCHAR(100) |
| category_id | INT |
| price | NUMERIC(15,2) |
| currency | VARCHAR(10) |

---

## Pages

### Public pages (everyone)

- **Home** (search bar, categories, featured vehicles, location selector).
- **Search / Listings** (filters: brand, model, year, price, location; sort; map toggle).
- **Vehicle Ad Detail** (gallery, specs, seller/store info, like button, chat/contact, preorder button if enabled).
- **Store Page** ( `/stores/:slug` ) fully customizable storefront (banner, gallery, theme, store ads).
- **Blog List + Blog Post** (vehicle reviews, guides).
- **About**
- **Contact / Support** (form + map).
- **Terms & Conditions**
- **Privacy Policy**

### Auth pages

- **Register** (buyer/seller)
- **Login**
- **Forgot password / Reset password**
- **Email verification** (optional but recommended)

### Buyer account pages

- **My Profile** (personal details, country/city).
- **Saved / Liked Ads** (favorites list).
- **My Chats** (conversation list + chat room).
- **My Order Requests** (create request, list requests, view matches).
- **My Preorders** (requests made on ads + statuses).
- **My Garage** (add vehicle, view estimated price).

### Seller / Store owner pages

- **Seller Dashboard** (stats: views, likes, messages, preorders).
- **Create Ad / Edit Ad** (wizard form + upload media with views).
- **My Ads** (draft/pending/active/sold).
- **Store Settings** (create store, change slug, business info).
- **Store Page Builder** (theme colors, buttons, sections, banner, favicon, gallery).
- **Preorder Inbox** (requests for ads → accept/reject/respond).
- **Payments / Billing** (buy extra ads, subscriptions if you add later).

### Admin pages (minimum)

- **Admin Login**
- **User management** (block/verify)
- **Ad moderation** (approve/reject, remove scam)
- **Store moderation**
- **Blog CMS** (create/edit/publish)

---

## API

Assume base URL: `/api` and JWT auth for protected endpoints.

### Public pages

#### Home

- `GET /api/meta/countries` (list supported countries)
- `GET /api/meta/categories`
- `GET /api/ads/featured?country=LK`
- `GET /api/search/suggestions?q=toyota` (optional)

#### Search / Listings

- `GET /api/ads?country=LK&city=Colombo&categoryId=1&brandId=..&modelId=..&yearMin=..&yearMax=..&priceMin=..&priceMax=..&sort=latest&page=1`
- `GET /api/meta/brands`
- `GET /api/meta/models?brandId=1`
- `GET /api/meta/body-types`
- (If map) `GET /api/ads/map?country=LK&bounds=...`

#### Vehicle Ad Detail

- `GET /api/ads/{adId}`
- `GET /api/ads/{adId}/media`
- `GET /api/stores/{storeId}` or `GET /api/stores/slug/{slug}` (if ad belongs to store)
- `GET /api/users/{sellerId}/public-profile`
- `POST /api/chat/conversations` (start/open conversation for this ad)
- `GET /api/chat/conversations/{conversationId}/messages`
- (If logged in) `GET /api/ads/{adId}/like-status`
- `POST /api/ads/{adId}/like` and `DELETE /api/ads/{adId}/like`
- (If preorder enabled) `POST /api/preorders` (create preorder for this ad)

#### Store page (public)

- `GET /api/stores/slug/{slug}`
- `GET /api/stores/{storeId}/page-config`
- `GET /api/stores/{storeId}/media`
- `GET /api/stores/{storeId}/ads?page=1&sort=latest`

#### Blog

- `GET /api/blog/posts?page=1`
- `GET /api/blog/posts/{slug}`

#### Contact/Support

- `POST /api/support/tickets` (or `/api/support/contact`)

### Auth pages

#### Register

- `POST /api/auth/register`
- `POST /api/auth/send-verification` (optional)
- `POST /api/auth/verify-email` (optional)

#### Login

- `POST /api/auth/login`
- `POST /api/auth/refresh` (optional refresh token)

#### Forgot / Reset password

- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Buyer pages

#### My profile / settings

- `GET /api/me`
- `PATCH /api/me`
- `GET /api/me/settings`
- `PATCH /api/me/settings`

#### Saved / liked ads

- `GET /api/me/likes?page=1`
- `POST /api/ads/{adId}/like`
- `DELETE /api/ads/{adId}/like`

#### My chats

- `GET /api/me/conversations`
- `GET /api/chat/conversations/{conversationId}/messages`
- `POST /api/chat/conversations/{conversationId}/messages` (send message)
- `POST /api/chat/conversations/{conversationId}/read` (mark read)
- WebSocket: `WS /api/ws/chat` (live messages)

#### My order requests (match system)

- `GET /api/me/order-requests`
- `POST /api/order-requests`
- `GET /api/order-requests/{id}`
- `GET /api/order-requests/{id}/matches`

#### My preorders (only for ads)

- `GET /api/me/preorders`
- `GET /api/preorders/{id}`
- `POST /api/preorders/{id}/messages` (if you allow messaging in preorder thread)
- `PATCH /api/preorders/{id}` (cancel)

#### My garage

- `GET /api/me/garage`
- `POST /api/garage-items`
- `PATCH /api/garage-items/{id}`
- `DELETE /api/garage-items/{id}`
- `POST /api/garage-items/{id}/estimate` (calculate estimated price)

### Seller / Store owner pages

#### Seller dashboard

- `GET /api/me/dashboard` (counts: active ads, views, likes, chats, preorders)
- `GET /api/me/notifications?unread=true`

#### Create/Edit ad

- `POST /api/ads`
- `PATCH /api/ads/{adId}`
- `POST /api/ads/{adId}/publish`
- `POST /api/ads/{adId}/media` (save media records after upload)
- (Uploads) `POST /api/media/presign-upload` → upload to S3 directly

#### My ads

- `GET /api/me/ads?status=ACTIVE&page=1`
- `POST /api/ads/{adId}/mark-sold`
- `POST /api/ads/{adId}/deactivate`

#### Store settings

- `POST /api/stores`
- `PATCH /api/stores/{storeId}`
- `GET /api/me/stores`

#### Store page builder (custom theme)

- `GET /api/stores/{storeId}/page-config`
- `PUT /api/stores/{storeId}/page-config`
- `POST /api/stores/{storeId}/media` (gallery items)

#### Preorder inbox (seller side)

- `GET /api/me/preorders?status=NEW`
- `GET /api/preorders/{id}`
- `PATCH /api/preorders/{id}` (set status CONTACTED/ACCEPTED/REJECTED)
- `POST /api/preorders/{id}/messages`

#### Payments / billing (PayHere)

- `GET /api/pricing?country=LK&month=2026-01-01`
- `POST /api/payments/create-session` (returns PayHere redirect/form)
- `GET /api/payments/{paymentId}`
- `POST /api/payments/payhere/callback` (server-to-server callback, not from browser)

### Admin pages (minimum)

- `POST /api/admin/login`
- `GET /api/admin/users?page=1`
- `PATCH /api/admin/users/{id}` (block/unblock)
- `GET /api/admin/ads?status=PENDING`
- `PATCH /api/admin/ads/{id}` (approve/reject)
- `GET /api/admin/stores`
- `PATCH /api/admin/stores/{id}` (suspend)

---

## Features

### User accounts & security

- Registration/login (buyer + seller), logout.
- Email verification, forgot/reset password, refresh tokens (optional).
- Roles & permissions: user, seller, admin (RBAC).
- Profile management: name, phone, country/city, address.
- Settings: language, currency, dark mode, notification preferences.

### Vehicle ads (listing management)

- Create/edit/delete vehicle ads with full details:
  - Brand/model, category, body type, year, mileage, fuel, transmission, condition, price/currency, location (country/city + lat/lng + address).
- Listing status lifecycle: draft → pending review → active → sold/expired → removed/rejected.
- Media gallery per ad:
  - Upload multiple images/videos.
  - Media "view" tagging: front/back/left/right + interior views + extras.
  - Ordering of images (sort order).
- Like/favorite system:
  - Users can like/save ads and view saved list (wish-list style).
- SEO-friendly ad pages (shareable URL, meta tags).

### Search & discovery

- Advanced filter search:
  - Make/model, year range, mileage range, price range, condition, fuel, transmission, category, body type.
- Location-based search:
  - Country/city filtering; radius or map bounding box using lat/lng.
- Sorting and pagination:
  - Latest, price low→high, price high→low, most viewed/liked (optional).
- Saved searches + alerts (optional but powerful):
  - User saves a filter and gets notified when matching ads arrive.
- AI vector/semantic search (optional):
  - Search using natural language; uses embeddings + vector similarity.

### Stores (dealer profiles + mini websites)

- Store creation for sellers with:
  - Store name, slug URL, description, business address, geo location.
- Store page is fully customizable:
  - Branding assets: favicon, logo, banner, thumbnail.
  - Theme config: page colors, button colors, typography, layout, sections, page builder structure, custom CSS/JS (stored in JSONB).
- Store gallery:
  - Store media uploads + ordering (store_media).
- Store inventory:
  - List all ads under a store with store-level filtering/sorting.

### Communication (chat + contact)

- Buyer ↔ seller chat:
  - Conversation per ad, message history, read/unread.
  - Real-time messaging (WebSocket) + offline persistence.
- Email notifications:
  - When a buyer contacts a seller, message/preorder events trigger email notification (based on settings).

### Preorder / reserve (ad-only)

- Seller can enable preorder per vehicle ad (`is_preorder_enabled`).
- Buyer can submit preorder request for an ad:
  - Contact details, message, budget range, optional deposit fields and payment link.
- Seller can manage preorder:
  - Status: NEW → CONTACTED → ACCEPTED/REJECTED/CANCELLED.
  - Threaded messages between buyer and seller (preorder_messages).

### "Order request" matching (wanted vehicle requests)

- Buyer posts "I want a vehicle like this" request:
  - Category/brand/model, budget, year range, location.
- Matching engine:
  - When a new ad is created/updated, match it to open requests and generate matches.
- Notifications on matches to buyers/sellers.

### Bidding / auctions (optional module)

- Seller can enable bidding for a listing:
  - Create auction event: start/end time, start price, reserve price, min increment.
- Buyers place bids:
  - Validate increments and ordering; show bid history.
- Auction status control:
  - Scheduled/running/ended/cancelled.

### My Garage (user's own vehicles)

- User stores owned vehicles:
  - Brand/model/year/mileage.
- Price estimation:
  - Estimate market price using marketplace listing data (analytics logic).

### Blog / content marketing

- Blog posts:
  - Create/edit/publish articles, SEO slug.
- Tags:
  - Add tags and filter by tag.
- Public blog pages:
  - Blog listing + post detail pages.

### Payments & monetization

- Free quota:
  - Limit free ads per user per period (e.g., 3 free ads).
- Pricing rules (multi-country, per category, monthly):
  - Admin sets monthly fees and currencies.
- PayHere payments:
  - Buy extra ad slots / premium posting / other paid features.

### Notifications system

- In-app notifications:
  - Chat message received, preorder update, order match found, payment success/fail.
- Notification read/unread tracking.
- Optional admin alerts for moderation/system events.

### Admin & moderation

- Admin dashboard:
  - Manage users, stores, ads, payments, content.
- Ad moderation:
  - Approve/reject listings; remove scams/spam; audit logs (optional).
- Store moderation:
  - Suspend stores, handle abuse reports.
- Chat safety/moderation tools (optional):
  - Flag/report messages and users.

---

## Conclusion

This project delivers a complete vehicle marketplace platform where buyers can discover vehicles through advanced search (including location-based and optional AI semantic search), and sellers can publish rich vehicle ads and run fully customizable store pages like mini websites. It also supports direct buyer–seller communication (chat, notifications), ad-level preorder/reservation requests, and marketplace growth features such as order-request matching, content/blog, and optional auctions.

From an engineering perspective, the solution is designed to start as a practical MVP (core ads + search + chat + stores + payments) and then scale into a high-traffic multi-country product by adding modules like vector search, analytics/price estimation ("My Garage"), and event-driven processing as usage grows. This keeps development manageable while still providing a clear path to a production-grade, monetizable marketplace.
