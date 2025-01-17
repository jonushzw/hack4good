
# Team ZAJJ | Hack 4 Good 2025
### Team Members
1. Jonus Ho Zhi Wen (Team Lead)
2. Li Sirui
3. Aninda Metta Citta
4. Lee Jia Kang

**Link to deployment**: https://hack4good-khaki.vercel.app/

**Contact us**: e1121923@u.nus.edu

## Scope Of Project

1. The web application provides a straightforward minimart system for residents to manage their voucher balances, request products, and view transaction history. 
2. The system also includes an admin interface for managing users, approving product requests, and exporting transaction data.
3. Built for Muhammadiyah Welfare Home, the application aims to streamline the minimart operations and improve the overall user experience for residents and administrators.

## Tech Stack

**Front-End:**

    1. React.js

    2. TypeScript

    3. Next.js

**Back-End:**

    1. Next.js

    2. Clerk (Authentication)

    3. Supabase + PostgresSQL (Database)

**Version Control:**

    1. GitHub


## Running the project
Link to deployment: https://matchfixing-orbital24.vercel.app/

Alternatively:
Our Project Runs on Next.js

Install these dependencies to run the project:

```bash
npm install
npm install next@latest react@latest react-dom@latest
npm install vercel
npm install @clerk/nextjs
npm install @clerk/clerk-react
npm install xlsx
npx shadcn@latest init
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add sidebar
```
### Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## Key Features of the System
1. **For Residents**:
   1. User-friendly dashboard to view voucher balances, transaction history, and available products.
   2. Easily request items from the minimart or place preorders for out-of-stock products. 
   3. Login System With Secure Authentication
2. **For Admins**:
   1. Manage users through Clerk, a secure authentication system. 
   2. Approve or reject voucher tasks and product requests with detailed tracking.
   3. View and manage transaction history and user balances.
   4. Export information to an Excel file for easy record-keeping.

## Problem Statement

### How We Addressed the Problem to streamline the minimart operations and improve the overall user experience
1. **Requirement Gathering**:
    1. Identify the core features required for the web minimart application.
    2. Define user roles and their respective functionalities (e.g., Residents, Admins).
    3. Gather requirements for the voucher management system, product request system, and authentication system.
2. **Design**:
    1. Create wireframes and mockups for the user interface.
    2. Design the database schema for storing user information, voucher balances, transaction history, and product details.
    3. Plan the API endpoints for interacting with the database.
3. **Development**:
    1. Set up the development environment with necessary tools and dependencies.
    2. Implement the front-end using React.js, TypeScript, and Next.js.
    3. Develop the back-end using Next.js, Clerk for authentication, and Supabase with PostgreSQL for the database.
    4. Integrate the front-end and back-end, ensuring secure communication and data handling.
4. **Deployment**:
    1. Deploy the application on Vercel for easy access and testing.
    2. Test the application for functionality, performance, and security.
    3. Address any bugs or issues identified during testing.
