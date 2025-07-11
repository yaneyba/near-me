-- Schema update to add latitude and longitude columns to businesses table
-- These columns are needed for map functionality and location-based features

ALTER TABLE businesses ADD COLUMN latitude REAL;
ALTER TABLE businesses ADD COLUMN longitude REAL;
