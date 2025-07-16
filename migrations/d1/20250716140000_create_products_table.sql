-- Migration: Create products table for specialty pet marketplace
-- Date: 2025-07-16
-- Description: Add products table to support product-based categories like specialty-pet

CREATE TABLE products (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    vendor_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    sale_price REAL,
    images TEXT, -- JSON array of image URLs
    category TEXT NOT NULL,
    subcategory_id TEXT,
    pet_types TEXT, -- JSON array of pet types
    rating REAL DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 0,
    tags TEXT, -- JSON array of tags
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (vendor_id) REFERENCES businesses(id)
);
