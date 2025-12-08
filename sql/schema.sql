-- PostgreSQL Schema for Tandoori Tastes Website
-- Run this to create all tables

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS "Category" (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Menu Items table
CREATE TABLE IF NOT EXISTS "MenuItem" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    "imageUrl" TEXT,
    "categoryId" TEXT NOT NULL REFERENCES "Category"(id) ON DELETE RESTRICT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Site Settings table
CREATE TABLE IF NOT EXISTS "SiteSettings" (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Content Blocks table
CREATE TABLE IF NOT EXISTS "ContentBlock" (
    id TEXT PRIMARY KEY,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    content TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(page, section)
);

-- Home Slider table
CREATE TABLE IF NOT EXISTS "HomeSlider" (
    id TEXT PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    caption TEXT,
    "altText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS "Announcement" (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    "bgColor" TEXT NOT NULL DEFAULT '#8B0000',
    "startDate" TIMESTAMP,
    "endDate" TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Featured Dishes table
CREATE TABLE IF NOT EXISTS "FeaturedDish" (
    id TEXT PRIMARY KEY,
    "menuItemId" TEXT NOT NULL REFERENCES "MenuItem"(id) ON DELETE CASCADE,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Store Hours table
CREATE TABLE IF NOT EXISTS "StoreHours" (
    id TEXT PRIMARY KEY,
    "dayOfWeek" INTEGER UNIQUE NOT NULL,
    "openTime" TEXT,
    "closeTime" TEXT,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Holidays table
CREATE TABLE IF NOT EXISTS "Holiday" (
    id TEXT PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    "isClosed" BOOLEAN NOT NULL DEFAULT true,
    "overrideOpenTime" TEXT,
    "overrideCloseTime" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Store Settings table
CREATE TABLE IF NOT EXISTS "StoreSettings" (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS "Review" (
    id TEXT PRIMARY KEY,
    "reviewerName" TEXT NOT NULL,
    "reviewerImageUrl" TEXT,
    rating INTEGER NOT NULL,
    text TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_item_category ON "MenuItem"("categoryId");
CREATE INDEX IF NOT EXISTS idx_content_block_page ON "ContentBlock"(page);
CREATE INDEX IF NOT EXISTS idx_featured_dish_menu_item ON "FeaturedDish"("menuItemId");
CREATE INDEX IF NOT EXISTS idx_announcement_active ON "Announcement"("isActive");
CREATE INDEX IF NOT EXISTS idx_review_visible ON "Review"("isVisible");

