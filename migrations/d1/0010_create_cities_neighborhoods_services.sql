-- Migration to create cities, neighborhoods, and services tables
-- This replaces the static JSON files with proper relational data

-- Cities table (derived from existing business data)
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  state TEXT,
  display_name TEXT, -- For proper capitalization (e.g., "San Francisco" vs "san-francisco")
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city_id TEXT NOT NULL,
  display_name TEXT, -- For proper capitalization
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (city_id) REFERENCES cities(id),
  UNIQUE(name, city_id) -- Prevent duplicate neighborhoods in same city
);

-- Service categories table (replaces services.json)
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- plumbers, nail-salons, etc.
  display_name TEXT, -- For proper capitalization
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(name, category) -- Prevent duplicate services in same category
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_id ON neighborhoods(city_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
