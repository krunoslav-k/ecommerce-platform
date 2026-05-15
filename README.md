# E-commerce Platform

A modern full-stack e-commerce application built with Next.js, featuring both a customer-facing storefront and a fully functional admin dashboard (CMS). The project focuses on performance, clean UI, and a realistic shopping experience similar to production-grade online stores, while also demonstrating practical content management and backend-driven product administration.

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling & UI:** TailwindCSS, shadcn/ui
- **Backend:** Next.js Server Actions
- **Authentication:** Clerk (role-based access control & social login)
- **Database:** SQLite (via Prisma ORM)
- **ORM:** Prisma (type-safe database access and schema management)
- **Validation:** Zod (schema-based validation for forms and server inputs)

## Features

- Admin dashboard (CMS for products and orders)
- Full CRUD Functionality: create, edit, and delete products with real-time updates
- Secure Authentication: integrated with Clerk for robust user management
- Role-Based Access Control: middleware-level protection ensuring only authorized users with the admin role can access management routes

## Planned Features

### Admin

- View all products with detailed information
- View customers
- View all orders and order details

### Storefront

- Product and category browsing
- Product detail page
- Add to cart functionality (state + local storage)
- Checkout process
