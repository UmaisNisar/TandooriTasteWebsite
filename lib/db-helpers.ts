import { query } from './db';
import { randomUUID } from 'crypto';

// Re-export query for direct use
export { query } from './db';

// Helper function to generate CUID-like IDs (using crypto.randomUUID)
export function generateId(): string {
  return randomUUID();
}

// Helper to format dates for PostgreSQL
export function formatDate(date: Date): string {
  return date.toISOString();
}

// User helpers
export const userQueries = {
  findMany: async () => {
    const result = await query('SELECT * FROM "User" ORDER BY "createdAt" DESC');
    return result.rows;
  },
  findUnique: async (where: { email?: string; id?: string }) => {
    let sql = 'SELECT * FROM "User" WHERE';
    const params: any[] = [];

    if (where.email) {
      sql += ' email = $1';
      params.push(where.email);
    } else if (where.id) {
      sql += ' id = $1';
      params.push(where.id);
    } else {
      return null;
    }

    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  findFirst: async (where: { email?: string; role?: string }) => {
    let sql = 'SELECT * FROM "User" WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (where.email) {
      sql += ` AND email = $${paramIndex}`;
      params.push(where.email);
      paramIndex++;
    }
    if (where.role) {
      sql += ` AND role = $${paramIndex}`;
      params.push(where.role);
      paramIndex++;
    }
    sql += ' LIMIT 1';

    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  create: async (data: { email: string; name?: string; password: string; role?: string }) => {
    const id = generateId();
    const result = await query(
      `INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [id, data.email, data.name || null, data.password, data.role || 'USER']
    );
    return result.rows[0];
  },
  update: async (id: string, data: Partial<{ name: string; password: string; role: string }>) => {
    const updates: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(data.name);
      paramIndex++;
    }
    if (data.password !== undefined) {
      updates.push(`password = $${paramIndex}`);
      params.push(data.password);
      paramIndex++;
    }
    if (data.role !== undefined) {
      updates.push(`role = $${paramIndex}`);
      params.push(data.role);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`"updatedAt" = NOW()`);
    const sql = `UPDATE "User" SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  deleteMany: async (where?: { email?: string }) => {
    let sql = 'DELETE FROM "User"';
    const params: any[] = [];
    
    if (where?.email) {
      sql += ' WHERE email = $1';
      params.push(where.email);
    }
    
    await query(sql, params);
  },
};

// ContentBlock helpers
export const contentBlockQueries = {
  findMany: async (where?: { page?: string }) => {
    let sql = 'SELECT * FROM "ContentBlock"';
    const params: any[] = [];
    
    if (where?.page) {
      sql += ' WHERE page = $1';
      params.push(where.page);
    }
    sql += ' ORDER BY "order" ASC';

    const result = await query(sql, params);
    return result.rows;
  },
  findFirst: async (where: { page: string; section: string }) => {
    const result = await query(
      'SELECT * FROM "ContentBlock" WHERE page = $1 AND section = $2 LIMIT 1',
      [where.page, where.section]
    );
    return result.rows[0] || null;
  },
  upsert: async (data: { page: string; section: string; content: string; order?: number }) => {
    const result = await query(
      `INSERT INTO "ContentBlock" (id, page, section, content, "order", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (page, section) 
       DO UPDATE SET content = $4, "order" = $5, "updatedAt" = NOW()
       RETURNING *`,
      [generateId(), data.page, data.section, data.content, data.order || 0]
    );
    return result.rows[0];
  },
  update: async (id: string, data: { content?: string; order?: number }) => {
    const updates: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (data.content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      params.push(data.content);
      paramIndex++;
    }
    if (data.order !== undefined) {
      updates.push(`"order" = $${paramIndex}`);
      params.push(data.order);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`"updatedAt" = NOW()`);
    const sql = `UPDATE "ContentBlock" SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  delete: async (id: string) => {
    await query('DELETE FROM "ContentBlock" WHERE id = $1', [id]);
  },
};

// StoreHours helpers
export const storeHoursQueries = {
  findMany: async () => {
    const result = await query('SELECT * FROM "StoreHours" ORDER BY "dayOfWeek" ASC');
    return result.rows;
  },
  findUnique: async (where: { dayOfWeek: number }) => {
    const result = await query('SELECT * FROM "StoreHours" WHERE "dayOfWeek" = $1', [where.dayOfWeek]);
    return result.rows[0] || null;
  },
  upsert: async (data: { dayOfWeek: number; openTime?: string; closeTime?: string; isClosed?: boolean }) => {
    const result = await query(
      `INSERT INTO "StoreHours" (id, "dayOfWeek", "openTime", "closeTime", "isClosed", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT ("dayOfWeek")
       DO UPDATE SET "openTime" = $3, "closeTime" = $4, "isClosed" = $5, "updatedAt" = NOW()
       RETURNING *`,
      [generateId(), data.dayOfWeek, data.openTime || null, data.closeTime || null, data.isClosed || false]
    );
    return result.rows[0];
  },
};

// FeaturedDish helpers
export const featuredDishQueries = {
  findMany: async (includeMenuItem?: boolean) => {
    if (includeMenuItem) {
      const result = await query(
        `SELECT 
          fd.*,
          mi.id as "menuItem_id",
          mi.name as "menuItem_name",
          mi.description as "menuItem_description",
          mi.price as "menuItem_price",
          mi."imageUrl" as "menuItem_imageUrl",
          c.id as "menuItem_category_id",
          c.name as "menuItem_category_name",
          c.slug as "menuItem_category_slug"
        FROM "FeaturedDish" fd
        JOIN "MenuItem" mi ON fd."menuItemId" = mi.id
        JOIN "Category" c ON mi."categoryId" = c.id
        ORDER BY fd."order" ASC`
      );
      // Transform the flat result into nested structure
      return result.rows.map(row => ({
        id: row.id,
        menuItemId: row.menuItem_id,
        order: row.order,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        menuItem: {
          id: row.menuItem_id,
          name: row.menuItem_name,
          description: row.menuItem_description,
          price: parseFloat(row.menuItem_price),
          imageUrl: row.menuItem_imageUrl,
          category: {
            id: row.menuItem_category_id,
            name: row.menuItem_category_name,
            slug: row.menuItem_category_slug,
          },
        },
      }));
    } else {
      const result = await query(
        `SELECT 
          fd.*,
          mi.id as "menuItem_id",
          mi.name as "menuItem_name",
          mi.description as "menuItem_description",
          mi.price as "menuItem_price",
          mi."imageUrl" as "menuItem_imageUrl"
        FROM "FeaturedDish" fd
        JOIN "MenuItem" mi ON fd."menuItemId" = mi.id
        ORDER BY fd."order" ASC`
      );
      return result.rows.map(row => ({
        id: row.id,
        menuItemId: row.menuItem_id,
        order: row.order,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        menuItem: {
          id: row.menuItem_id,
          name: row.menuItem_name,
          description: row.menuItem_description,
          price: parseFloat(row.menuItem_price),
          imageUrl: row.menuItem_imageUrl,
        },
      }));
    }
  },
  create: async (data: { menuItemId: string; order?: number }) => {
    const id = generateId();
    const result = await query(
      `INSERT INTO "FeaturedDish" (id, "menuItemId", "order", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [id, data.menuItemId, data.order || 0]
    );
    return result.rows[0];
  },
  delete: async (id: string) => {
    await query('DELETE FROM "FeaturedDish" WHERE id = $1', [id]);
  },
};

// Category helpers
export const categoryQueries = {
  findMany: async () => {
    const result = await query('SELECT * FROM "Category" ORDER BY name ASC');
    return result.rows;
  },
  findUnique: async (where: { id?: string; slug?: string }) => {
    let sql = 'SELECT * FROM "Category" WHERE';
    const params: any[] = [];

    if (where.id) {
      sql += ' id = $1';
      params.push(where.id);
    } else if (where.slug) {
      sql += ' slug = $1';
      params.push(where.slug);
    } else {
      return null;
    }

    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  create: async (data: { name: string; slug: string }) => {
    const id = generateId();
    const result = await query(
      `INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [id, data.name, data.slug]
    );
    return result.rows[0];
  },
  update: async (id: string, data: Partial<{ name: string; slug: string }>) => {
    const updates: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(data.name);
      paramIndex++;
    }
    if (data.slug !== undefined) {
      updates.push(`slug = $${paramIndex}`);
      params.push(data.slug);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`"updatedAt" = NOW()`);
    const sql = `UPDATE "Category" SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  delete: async (id: string) => {
    await query('DELETE FROM "Category" WHERE id = $1', [id]);
  },
  count: async (where?: { categoryId?: string }) => {
    let sql = 'SELECT COUNT(*) as count FROM "Category"';
    const params: any[] = [];
    
    if (where?.categoryId) {
      sql += ' WHERE id = $1';
      params.push(where.categoryId);
    }
    
    const result = await query(sql, params);
    return parseInt(result.rows[0].count);
  },
};

// MenuItem helpers
export const menuItemQueries = {
  findMany: async (where?: { categoryId?: string }, includeCategory?: boolean) => {
    let sql: string;
    const params: any[] = [];
    
    if (includeCategory) {
      sql = `SELECT 
        mi.*,
        c.id as "category_id",
        c.name as "category_name",
        c.slug as "category_slug"
      FROM "MenuItem" mi
      JOIN "Category" c ON mi."categoryId" = c.id`;
      
      if (where?.categoryId) {
        sql += ' WHERE mi."categoryId" = $1';
        params.push(where.categoryId);
      }
      sql += ' ORDER BY mi.name ASC';
    } else {
      sql = 'SELECT * FROM "MenuItem"';
      if (where?.categoryId) {
        sql += ' WHERE "categoryId" = $1';
        params.push(where.categoryId);
      }
      sql += ' ORDER BY name ASC';
    }

    const result = await query(sql, params);
    
    if (includeCategory) {
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        imageUrl: row.imageUrl,
        categoryId: row.categoryId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        category: {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
        }
      }));
    }
    
    return result.rows;
  },
  findUnique: async (where: { id: string }) => {
    const result = await query('SELECT * FROM "MenuItem" WHERE id = $1', [where.id]);
    return result.rows[0] || null;
  },
  create: async (data: { name: string; description: string; price: number; imageUrl?: string; categoryId: string }) => {
    const id = generateId();
    const result = await query(
      `INSERT INTO "MenuItem" (id, name, description, price, "imageUrl", "categoryId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [id, data.name, data.description, data.price, data.imageUrl || null, data.categoryId]
    );
    return result.rows[0];
  },
  update: async (id: string, data: Partial<{ name: string; description: string; price: number; imageUrl: string; categoryId: string }>) => {
    const updates: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(data.name);
      paramIndex++;
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(data.description);
      paramIndex++;
    }
    if (data.price !== undefined) {
      updates.push(`price = $${paramIndex}`);
      params.push(data.price);
      paramIndex++;
    }
    if (data.imageUrl !== undefined) {
      updates.push(`"imageUrl" = $${paramIndex}`);
      params.push(data.imageUrl);
      paramIndex++;
    }
    if (data.categoryId !== undefined) {
      updates.push(`"categoryId" = $${paramIndex}`);
      params.push(data.categoryId);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`"updatedAt" = NOW()`);
    const sql = `UPDATE "MenuItem" SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  delete: async (id: string) => {
    await query('DELETE FROM "MenuItem" WHERE id = $1', [id]);
  },
  count: async (where?: { categoryId?: string }) => {
    let sql = 'SELECT COUNT(*) as count FROM "MenuItem"';
    const params: any[] = [];
    
    if (where?.categoryId) {
      sql += ' WHERE "categoryId" = $1';
      params.push(where.categoryId);
    }
    
    const result = await query(sql, params);
    return parseInt(result.rows[0].count);
  },
};

// Announcement helpers
export const announcementQueries = {
  findMany: async (where?: { isActive?: boolean; dateFilter?: boolean }) => {
    let sql = 'SELECT * FROM "Announcement"';
    const params: any[] = [];
    let paramIndex = 1;
    const conditions: string[] = [];
    
    if (where?.isActive !== undefined) {
      conditions.push(`"isActive" = $${paramIndex}`);
      params.push(where.isActive);
      paramIndex++;
    }
    
    // Date filtering for active announcements
    if (where?.dateFilter && where.isActive) {
      const now = new Date();
      conditions.push(`(
        ("startDate" IS NULL AND "endDate" IS NULL) OR
        ("startDate" IS NULL AND "endDate" >= $${paramIndex}) OR
        ("startDate" <= $${paramIndex} AND "endDate" IS NULL) OR
        ("startDate" <= $${paramIndex} AND "endDate" >= $${paramIndex})
      )`);
      params.push(now);
      paramIndex++;
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY "createdAt" DESC';

    const result = await query(sql, params);
    return result.rows;
  },
  findFirst: async (where: { isActive?: boolean }) => {
    let sql = 'SELECT * FROM "Announcement"';
    const params: any[] = [];
    
    if (where.isActive !== undefined) {
      sql += ' WHERE "isActive" = $1';
      params.push(where.isActive);
    }
    sql += ' ORDER BY "createdAt" DESC LIMIT 1';

    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  create: async (data: { text: string; bgColor?: string; startDate?: Date; endDate?: Date; isActive?: boolean }) => {
    const id = generateId();
    const result = await query(
      `INSERT INTO "Announcement" (id, text, "bgColor", "startDate", "endDate", "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [id, data.text, data.bgColor || '#8B0000', data.startDate || null, data.endDate || null, data.isActive !== false]
    );
    return result.rows[0];
  },
  update: async (id: string, data: Partial<{ text: string; bgColor: string; startDate: Date; endDate: Date; isActive: boolean }>) => {
    const updates: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (data.text !== undefined) {
      updates.push(`text = $${paramIndex}`);
      params.push(data.text);
      paramIndex++;
    }
    if (data.bgColor !== undefined) {
      updates.push(`"bgColor" = $${paramIndex}`);
      params.push(data.bgColor);
      paramIndex++;
    }
    if (data.startDate !== undefined) {
      updates.push(`"startDate" = $${paramIndex}`);
      params.push(data.startDate);
      paramIndex++;
    }
    if (data.endDate !== undefined) {
      updates.push(`"endDate" = $${paramIndex}`);
      params.push(data.endDate);
      paramIndex++;
    }
    if (data.isActive !== undefined) {
      updates.push(`"isActive" = $${paramIndex}`);
      params.push(data.isActive);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`"updatedAt" = NOW()`);
    const sql = `UPDATE "Announcement" SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  delete: async (id: string) => {
    await query('DELETE FROM "Announcement" WHERE id = $1', [id]);
  },
};

// HomeSlider helpers
export const homeSliderQueries = {
  findMany: async () => {
    const result = await query('SELECT * FROM "HomeSlider" ORDER BY "order" ASC');
    return result.rows;
  },
  create: async (data: { imageUrl: string; caption?: string; altText?: string; order?: number; isActive?: boolean }) => {
    const id = generateId();
    const result = await query(
      `INSERT INTO "HomeSlider" (id, "imageUrl", caption, "altText", "order", "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [id, data.imageUrl, data.caption || null, data.altText || null, data.order || 0, data.isActive !== false]
    );
    return result.rows[0];
  },
  update: async (id: string, data: Partial<{ imageUrl: string; caption: string; altText: string; order: number; isActive: boolean }>) => {
    const updates: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (data.imageUrl !== undefined) {
      updates.push(`"imageUrl" = $${paramIndex}`);
      params.push(data.imageUrl);
      paramIndex++;
    }
    if (data.caption !== undefined) {
      updates.push(`caption = $${paramIndex}`);
      params.push(data.caption);
      paramIndex++;
    }
    if (data.altText !== undefined) {
      updates.push(`"altText" = $${paramIndex}`);
      params.push(data.altText);
      paramIndex++;
    }
    if (data.order !== undefined) {
      updates.push(`"order" = $${paramIndex}`);
      params.push(data.order);
      paramIndex++;
    }
    if (data.isActive !== undefined) {
      updates.push(`"isActive" = $${paramIndex}`);
      params.push(data.isActive);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`"updatedAt" = NOW()`);
    const sql = `UPDATE "HomeSlider" SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  delete: async (id: string) => {
    await query('DELETE FROM "HomeSlider" WHERE id = $1', [id]);
  },
};

// Review helpers
export const reviewQueries = {
  findMany: async (where?: { isVisible?: boolean }) => {
    let sql = 'SELECT * FROM "Review"';
    const params: any[] = [];
    
    if (where?.isVisible !== undefined) {
      sql += ' WHERE "isVisible" = $1';
      params.push(where.isVisible);
    }
    sql += ' ORDER BY "createdAt" DESC';

    const result = await query(sql, params);
    return result.rows;
  },
  findFirst: async (where: { reviewerName?: string; text?: string }) => {
    let sql = 'SELECT * FROM "Review" WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (where.reviewerName) {
      sql += ` AND "reviewerName" = $${paramIndex}`;
      params.push(where.reviewerName);
      paramIndex++;
    }
    if (where.text) {
      sql += ` AND text = $${paramIndex}`;
      params.push(where.text);
      paramIndex++;
    }
    sql += ' LIMIT 1';

    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  create: async (data: { reviewerName: string; reviewerImageUrl?: string; rating: number; text: string; isVisible?: boolean }) => {
    const id = generateId();
    const result = await query(
      `INSERT INTO "Review" (id, "reviewerName", "reviewerImageUrl", rating, text, "isVisible", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [id, data.reviewerName, data.reviewerImageUrl || null, data.rating, data.text, data.isVisible !== false]
    );
    return result.rows[0];
  },
  update: async (id: string, data: Partial<{ reviewerName: string; reviewerImageUrl: string; rating: number; text: string; isVisible: boolean }>) => {
    const updates: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (data.reviewerName !== undefined) {
      updates.push(`"reviewerName" = $${paramIndex}`);
      params.push(data.reviewerName);
      paramIndex++;
    }
    if (data.reviewerImageUrl !== undefined) {
      updates.push(`"reviewerImageUrl" = $${paramIndex}`);
      params.push(data.reviewerImageUrl);
      paramIndex++;
    }
    if (data.rating !== undefined) {
      updates.push(`rating = $${paramIndex}`);
      params.push(data.rating);
      paramIndex++;
    }
    if (data.text !== undefined) {
      updates.push(`text = $${paramIndex}`);
      params.push(data.text);
      paramIndex++;
    }
    if (data.isVisible !== undefined) {
      updates.push(`"isVisible" = $${paramIndex}`);
      params.push(data.isVisible);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`"updatedAt" = NOW()`);
    const sql = `UPDATE "Review" SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  delete: async (id: string) => {
    await query('DELETE FROM "Review" WHERE id = $1', [id]);
  },
};

// StoreSettings helpers
export const storeSettingsQueries = {
  findMany: async () => {
    const result = await query('SELECT * FROM "StoreSettings" ORDER BY key ASC');
    return result.rows;
  },
  upsert: async (data: { key: string; value: string }) => {
    const result = await query(
      `INSERT INTO "StoreSettings" (id, key, value, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (key)
       DO UPDATE SET value = $3, "updatedAt" = NOW()
       RETURNING *`,
      [generateId(), data.key, data.value]
    );
    return result.rows[0];
  },
};

// SiteSettings helpers
export const siteSettingsQueries = {
  findMany: async () => {
    const result = await query('SELECT * FROM "SiteSettings" ORDER BY key ASC');
    return result.rows;
  },
  upsert: async (data: { key: string; value: string }) => {
    const result = await query(
      `INSERT INTO "SiteSettings" (id, key, value, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (key)
       DO UPDATE SET value = $3, "updatedAt" = NOW()
       RETURNING *`,
      [generateId(), data.key, data.value]
    );
    return result.rows[0];
  },
};

// Holiday helpers
export const holidayQueries = {
  findMany: async () => {
    const result = await query('SELECT * FROM "Holiday" ORDER BY date ASC');
    return result.rows;
  },
  findFirst: async (where: { date?: Date; dateRange?: { start: Date; end: Date } }) => {
    let sql = 'SELECT * FROM "Holiday"';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (where.date) {
      sql += ` WHERE DATE(date) = DATE($${paramIndex})`;
      params.push(where.date);
      paramIndex++;
    } else if (where.dateRange) {
      sql += ` WHERE date >= $${paramIndex} AND date < $${paramIndex + 1}`;
      params.push(where.dateRange.start, where.dateRange.end);
      paramIndex += 2;
    }
    sql += ' ORDER BY date ASC LIMIT 1';

    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  create: async (data: { date: Date; title: string; description?: string; isClosed?: boolean; overrideOpenTime?: string; overrideCloseTime?: string }) => {
    const id = generateId();
    const result = await query(
      `INSERT INTO "Holiday" (id, date, title, description, "isClosed", "overrideOpenTime", "overrideCloseTime", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [id, data.date, data.title, data.description || null, data.isClosed !== false, data.overrideOpenTime || null, data.overrideCloseTime || null]
    );
    return result.rows[0];
  },
  update: async (id: string, data: Partial<{ date: Date; title: string; description: string; isClosed: boolean; overrideOpenTime: string; overrideCloseTime: string }>) => {
    const updates: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (data.date !== undefined) {
      updates.push(`date = $${paramIndex}`);
      params.push(data.date);
      paramIndex++;
    }
    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      params.push(data.title);
      paramIndex++;
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(data.description);
      paramIndex++;
    }
    if (data.isClosed !== undefined) {
      updates.push(`"isClosed" = $${paramIndex}`);
      params.push(data.isClosed);
      paramIndex++;
    }
    if (data.overrideOpenTime !== undefined) {
      updates.push(`"overrideOpenTime" = $${paramIndex}`);
      params.push(data.overrideOpenTime);
      paramIndex++;
    }
    if (data.overrideCloseTime !== undefined) {
      updates.push(`"overrideCloseTime" = $${paramIndex}`);
      params.push(data.overrideCloseTime);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`"updatedAt" = NOW()`);
    const sql = `UPDATE "Holiday" SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  delete: async (id: string) => {
    await query('DELETE FROM "Holiday" WHERE id = $1', [id]);
  },
};

