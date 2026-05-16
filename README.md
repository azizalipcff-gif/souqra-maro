# SOUQORA - Moroccan Marketplace Platform

A world-class, production-ready Moroccan marketplace platform combining ecommerce, local services, business listings, and digital storefronts. Built with a premium modern Moroccan startup style featuring luxury UI, smooth animations, and comprehensive functionality.

## 🚀 Features

### Core Platform
- **Marketplace**: Browse and buy products from sellers across Morocco
- **Services**: Find and book local service providers
- **Business Listings**: Discover and connect with local businesses
- **Multi-User System**: Support for customers, sellers, businesses, and admins
- **WhatsApp Integration**: Direct communication with sellers and service providers

### User Features
- **Authentication**: Secure JWT-based login and registration
- **User Profiles**: Manage personal information and preferences
- **Favorites**: Save products and services for later
- **Order Management**: Track orders and view order history
- **Reviews & Ratings**: Share experiences with products and services

### Seller Features
- **Store Management**: Create and customize seller storefronts
- **Product Management**: Add, edit, and manage product listings
- **Service Listings**: Offer services to customers
- **Analytics Dashboard**: View sales, orders, and performance metrics
- **Order Processing**: Manage and fulfill customer orders

### Admin Features
- **Platform Management**: Full admin dashboard for platform oversight
- **User Management**: Manage users, sellers, and business accounts
- **Content Moderation**: Approve/reject products, services, and sellers
- **Report Handling**: Review and resolve user reports
- **System Monitoring**: Track platform health and performance

### Technical Features
- **Modern UI**: Luxury Moroccan-inspired design with glassmorphism
- **Smooth Animations**: Framer Motion for fluid transitions
- **Responsive Design**: Mobile-first approach for all devices
- **SEO Optimized**: Built-in SEO best practices
- **Type Safety**: Full TypeScript implementation
- **Secure**: Rate limiting, input validation, and role-based permissions

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom Moroccan theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Components**: Custom reusable UI components

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **API**: Next.js API Routes
- **Security**: Rate limiting, input validation, CORS

### Integrations (Planned)
- **Image Storage**: Cloudinary
- **Payments**: Stripe, PayPal, Cash Plus, Bank Transfer
- **Messaging**: Real-time chat system
- **Notifications**: In-app and email notifications

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm, yarn, or pnpm

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/souqora.git
cd souqora
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=souqora
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways (optional)
STRIPE_SECRET_KEY=your_stripe_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
```

4. **Set up the database**
```bash
# Run the schema file
psql -U postgres -d souqora -f src/lib/db/schema.sql
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
souqora/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── products/      # Product endpoints
│   │   │   ├── orders/        # Order endpoints
│   │   │   └── ...
│   │   ├── auth/              # Authentication pages
│   │   ├── marketplace/       # Marketplace page
│   │   ├── services/          # Services page
│   │   ├── products/          # Product pages
│   │   ├── stores/            # Store pages
│   │   ├── dashboard/         # Seller dashboard
│   │   ├── admin/             # Admin dashboard
│   │   ├── profile/           # User profile
│   │   ├── favorites/         # Favorites page
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout page
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   └── ...
│   │   └── layout/           # Layout components
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       └── sidebar.tsx
│   ├── lib/                  # Utility libraries
│   │   ├── db/              # Database utilities
│   │   │   ├── schema.sql   # Database schema
│   │   │   └── models.ts    # Database models
│   │   ├── security/        # Security utilities
│   │   │   ├── auth.ts      # Authentication
│   │   │   ├── rate-limit.ts
│   │   │   ├── middleware.ts
│   │   │   └── validation.ts
│   │   └── utils.ts         # General utilities
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── app/
│       ├── globals.css      # Global styles
│       └── layout.tsx       # Root layout
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Design System

### Moroccan Theme Colors
- **Royal Blue**: `#1e40af` - Primary brand color
- **Gold**: `#d4af37` - Accent and highlights
- **Dark Navy**: `#0f172a` - Dark backgrounds
- **White**: `#ffffff` - Light backgrounds

### Glassmorphism
The platform uses glassmorphism effects with backdrop filters and semi-transparent backgrounds for a modern, premium look.

### Animations
All page transitions and interactions use Framer Motion for smooth, fluid animations.

## 🔐 Security

- **Authentication**: JWT-based secure authentication
- **Password Hashing**: bcrypt for password encryption
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization and validation
- **Role-Based Access**: Permission system for different user roles
- **CORS**: Configured CORS policies for API security

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker
```bash
# Build image
docker build -t souqora .

# Run container
docker run -p 3000:3000 souqora
```

### Traditional Hosting
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (requires auth)
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product (requires auth)
- `DELETE /api/products/[id]` - Delete product (requires auth)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [TailwindCSS](https://tailwindcss.com)
- Icons by [Lucide](https://lucide.dev)
- Animations by [Framer Motion](https://www.framer.com/motion)

## 📞 Support

For support, email support@souqora.ma or open an issue in the repository.
