# Tandoori Tastes Restaurant Website

A modern, fully-responsive restaurant website built with Next.js 14, featuring a complete admin panel for content management.

## Features

- 🎨 Modern, elegant design with warm color theme
- 📱 Fully responsive (mobile-first approach)
- 🔐 Secure admin panel with authentication
- 📝 Complete content management system
- 🍽️ Dynamic menu management
- ⭐ Reviews/Testimonials management
- 🏪 Store hours and holiday management
- 🖼️ Image upload and gallery management
- 📢 Announcements and specials

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Database**: SQLite (Prisma ORM)
- **Authentication**: NextAuth.js v5
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd TandooriTasteWebsite
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file:
```env
NEXTAUTH_SECRET=your-secure-secret-here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
npm run seed
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the admin password immediately after first login!

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin panel routes
│   ├── api/               # API routes
│   ├── menu/              # Menu page
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # React components
├── lib/                   # Utilities and configurations
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with initial data

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

## Admin Panel Features

- **Menu Management**: Add, edit, delete menu items and categories
- **Content Management**: Edit all website content (homepage, about, contact)
- **Home Slider**: Upload and manage hero images
- **Announcements**: Create promotional banners
- **Store Management**: Set hours, holidays, delivery links
- **Reviews**: Manage customer testimonials
- **Site Settings**: Configure site-wide settings

## Database

The application uses Prisma ORM with SQLite for development. For production, consider migrating to PostgreSQL.

## Security

- Admin routes are protected by middleware
- Passwords are hashed with bcrypt
- CSRF protection via NextAuth
- Environment variables for sensitive data

## License

Private - All rights reserved

## Support

For issues or questions, please contact the development team.

