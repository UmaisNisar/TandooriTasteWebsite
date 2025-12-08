-- Seed script for Tandoori Tastes Website
-- Run this after creating the schema

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin',
  'Admin User',
  '$2a$10$rOzJqXJqXJqXJqXJqXJqXeJqXJqXJqXJqXJqXJqXJqXJqXJqXJqXJqXJq',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'Appetizers', 'appetizers', NOW(), NOW()),
  (gen_random_uuid()::text, 'Main Courses', 'main-courses', NOW(), NOW()),
  (gen_random_uuid()::text, 'Desserts', 'desserts', NOW(), NOW()),
  (gen_random_uuid()::text, 'Beverages', 'beverages', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Note: This is a template. You'll need to:
-- 1. Generate proper bcrypt hash for admin password
-- 2. Add actual menu items, content blocks, etc.
-- 3. Or use the Node.js seed script that handles this properly

