# CustomCraft E-Commerce Platform

A modern, well-architected e-commerce web application built with React, TypeScript, and Vite for selling customized laser engraved and CNC cut items.

## 🏗️ Project Architecture

This project follows industry best practices with a clean, scalable architecture:

```
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── Header/
│   └── Footer/
├── constants/           # Application constants and configuration
├── contexts/            # React Context for global state management
│   └── CartContext.tsx
├── pages/               # Page-level components
│   ├── HomePage/
│   ├── ProductsPage/
│   ├── ProductDetailPage/
│   ├── CheckoutPage/
│   └── BlogPage/
├── services/            # Business logic and API calls
│   ├── product.service.ts
│   ├── blog.service.ts
│   └── checkout.service.ts
├── types/               # TypeScript type definitions
│   ├── product.types.ts
│   ├── cart.types.ts
│   └── blog.types.ts
├── utils/               # Utility functions
│   └── helpers.ts
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🎯 Features

### Current Implementation (Bare-bones)

- **Home Page**: Hero section, services showcase, featured products, occasions grid
- **Products Page**: Product listing with filters (material type, occasion, price range)
- **Product Detail Page**: Product information, customization options (text, image), live preview
- **Checkout Page**: Shipping information, payment methods (Credit Card, PayPal, Apple Pay), order summary
- **Blog Page**: Blog posts grid with sidebar (search, categories, recent posts)
- **Shopping Cart**: Global cart state management with Context API
- **Responsive Design**: Mobile-friendly layouts

### Planned Features

- Full product catalog with real data
- User authentication and accounts
- Order history and tracking
- Reviews and ratings system
- Blog post detail pages with comments
- Admin dashboard
- Payment gateway integration
- Email notifications
- Advanced search and filtering

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design Principles

1. **Separation of Concerns**: Clear separation between UI components, business logic, and data
2. **Type Safety**: Comprehensive TypeScript types for all data structures
3. **Reusability**: Modular components and services
4. **Scalability**: Easy to add new features and pages
5. **Maintainability**: Organized folder structure with clear naming conventions

## 📁 Key Directories Explained

### `/components`
Reusable UI components used across multiple pages (Header, Footer, ProductCard, etc.)

### `/pages`
Page-level components that represent different routes in the application

### `/services`
Business logic layer that handles API calls and data processing. Currently uses mock data, ready to be connected to a backend API.

### `/contexts`
React Context providers for global state management (currently CartContext for shopping cart)

### `/types`
TypeScript interfaces and types for type safety across the application

### `/constants`
Application-wide constants like routes, tax rates, pagination settings

### `/utils`
Helper functions for common operations (formatting, validation, etc.)

## 🔄 State Management

The application uses React Context API for global state management:

- **CartContext**: Manages shopping cart state and operations (add, remove, update)

## 🚀 Next Steps

1. Connect to backend API (replace mock data in services)
2. Implement authentication
3. Add product management
4. Integrate payment gateway
5. Add blog CMS integration
6. Implement search functionality
7. Add product reviews system
8. Create admin dashboard

## 📝 Notes

- All service methods are currently using mock data
- Payment processing is simulated (not connected to real gateways)
- Blog comments are stored locally (needs backend integration)
- Images are placeholders (need to add real product images)

## 🤝 Contributing

This is a learning project. Feel free to extend and modify as needed!

---

Built with ❤️ using React + TypeScript + Vite
