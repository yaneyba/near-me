-- Migration: Add specialty pet products
-- Date: 2025-07-16
-- Description: Populate products table with specialty pet products

-- Insert specialty pet products
INSERT INTO products (
    vendor_id, name, description, price, sale_price, images, category, 
    subcategory_id, pet_types, rating, review_count, is_featured, 
    featured, tags, is_active, created_at, updated_at
) VALUES 
-- Get the vendor_id for Redbarn Pet Products first, then add their products
((SELECT id FROM businesses WHERE business_id = 'specialty-pet-redbarn-01'), 'Collagen Stick', 'Digestible, long-lasting chew for dental health', 3.19, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'treats', 'dog-treats', '["dog"]', 4.6, 87, 0, 0, '["dental", "chew", "digestible"]', 1, datetime('now'), datetime('now')),

((SELECT id FROM businesses WHERE business_id = 'specialty-pet-redbarn-01'), 'Choppers®', 'Natural beef lung treats for dogs', 14.19, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'treats', 'dog-treats', '["dog"]', 4.5, 64, 0, 0, '["natural", "beef", "protein"]', 1, datetime('now'), datetime('now')),

((SELECT id FROM businesses WHERE business_id = 'specialty-pet-redbarn-01'), 'Beef Jerky', 'Premium protein-rich dog treats', 6.99, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'treats', 'dog-treats', '["dog"]', 4.7, 112, 0, 0, '["jerky", "beef", "protein"]', 1, datetime('now'), datetime('now')),

((SELECT id FROM businesses WHERE business_id = 'specialty-pet-redbarn-01'), 'Filled Bone Peanut Butter', 'Long-lasting bone filled with peanut butter', 3.99, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'treats', 'dog-treats', '["dog"]', 4.4, 76, 0, 0, '["bone", "peanut-butter", "long-lasting"]', 1, datetime('now'), datetime('now')),

((SELECT id FROM businesses WHERE business_id = 'specialty-pet-redbarn-01'), 'Braided Bully Stick', 'Premium, long-lasting dog chew made from natural beef', 9.98, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'treats', 'dog-treats', '["dog"]', 4.7, 128, 1, 1, '["natural", "chew", "dental"]', 1, datetime('now'), datetime('now')),

((SELECT id FROM businesses WHERE business_id = 'specialty-pet-redbarn-01'), 'Bully Stick', 'All-natural, high-protein dog chew', 5.29, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'treats', 'dog-treats', '["dog"]', 4.8, 156, 1, 1, '["natural", "chew", "protein"]', 1, datetime('now'), datetime('now')),

-- Harry Barker Products
((SELECT id FROM businesses WHERE business_id = 'specialty-pet-harry-barker-15'), 'Hidden Stash Acorn Treater Dog Toy', 'Interactive treat-dispensing toy in acorn design', 16.00, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'toys', 'dog-toys', '["dog"]', 4.6, 43, 0, 0, '["interactive", "treat-dispenser", "mental-stimulation"]', 1, datetime('now'), datetime('now')),

((SELECT id FROM businesses WHERE business_id = 'specialty-pet-harry-barker-15'), 'Collage Ball Dog Toy', 'Eco-friendly plush ball toy', 16.00, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'toys', 'dog-toys', '["dog"]', 4.5, 67, 0, 0, '["eco-friendly", "plush", "ball"]', 1, datetime('now'), datetime('now')),

((SELECT id FROM businesses WHERE business_id = 'specialty-pet-harry-barker-15'), 'Herringbone Owl Dog Toy', 'Designer plush owl toy with sustainable materials', 16.00, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'toys', 'dog-toys', '["dog"]', 4.6, 54, 0, 0, '["eco-friendly", "plush", "designer"]', 1, datetime('now'), datetime('now')),

((SELECT id FROM businesses WHERE business_id = 'specialty-pet-harry-barker-15'), 'Fluffy Couch Lounger Bed', 'Premium eco-friendly dog sofa', 130.00, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'beds', 'dog-beds', '["dog"]', 4.9, 87, 1, 1, '["premium", "eco-friendly", "sofa"]', 1, datetime('now'), datetime('now')),

-- The Honest Kitchen Products
((SELECT id FROM businesses WHERE business_id = 'specialty-pet-honest-kitchen-10'), 'Organic Chicken Jerky', 'Human-grade, dehydrated chicken treats', 12.99, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'treats', 'dog-treats', '["dog"]', 4.9, 187, 1, 1, '["organic", "human-grade", "chicken"]', 1, datetime('now'), datetime('now')),

-- West Paw Products
((SELECT id FROM businesses WHERE business_id = 'specialty-pet-west-paw-16'), 'Zogoflex Toppl Interactive Treat Toy', 'Durable, dishwasher-safe puzzle toy', 19.95, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'toys', 'dog-toys', '["dog"]', 4.8, 176, 1, 1, '["durable", "interactive", "puzzle"]', 1, datetime('now'), datetime('now')),

((SELECT id FROM businesses WHERE business_id = 'specialty-pet-west-paw-16'), 'Eco-friendly Hemp Bed', 'Sustainable, machine-washable dog bed', 149.00, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'beds', 'dog-beds', '["dog"]', 4.7, 76, 0, 0, '["sustainable", "hemp", "washable"]', 1, datetime('now'), datetime('now')),

-- Big Barker Products
((SELECT id FROM businesses WHERE business_id = 'specialty-pet-big-barker-17'), 'Orthopedic Memory Foam Bed', 'Therapeutic bed for large breeds and senior dogs', 279.95, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'beds', 'dog-beds', '["dog"]', 4.9, 215, 1, 1, '["orthopedic", "memory-foam", "large-breed"]', 1, datetime('now'), datetime('now')),

-- Ruffwear Products
((SELECT id FROM businesses WHERE business_id = 'specialty-pet-ruffwear-13'), 'Reflective Safety Harness', 'High-performance adventure harness', 59.95, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'accessories', 'dog-accessories', '["dog"]', 4.9, 198, 1, 1, '["reflective", "safety", "adventure"]', 1, datetime('now'), datetime('now')),

-- Charlotte's Web Products
((SELECT id FROM businesses WHERE business_id = 'specialty-pet-charlotte-02'), 'Calming Hemp Oil', 'Full-spectrum hemp extract for anxiety', 59.99, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'wellness', 'dog-wellness', '["dog"]', 4.8, 143, 1, 1, '["hemp", "calming", "anxiety"]', 1, datetime('now'), datetime('now')),

-- CatastrophiCreations Products
((SELECT id FROM businesses WHERE business_id = 'specialty-pet-catastrophi-18'), 'Wall-Mounted Cat Shelf Set', 'Handcrafted wooden cat furniture', 149.99, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'cat-furniture', 'cat-furniture', '["cat"]', 4.9, 156, 1, 1, '["wall-mounted", "handcrafted", "wooden"]', 1, datetime('now'), datetime('now')),

-- Litter-Robot Products
((SELECT id FROM businesses WHERE business_id = 'specialty-pet-litter-robot-19'), 'Self-Cleaning Litter Box', 'Automated waste management system', 499.00, NULL, '["https://finderhubs.imgix.net/defaults/default-image.png"]', 'cat-accessories', 'cat-accessories', '["cat"]', 4.8, 198, 1, 1, '["self-cleaning", "automated", "litter-box"]', 1, datetime('now'), datetime('now'));
