-- Migration: Add Specialty Pet Vendors
-- Date: 2025-07-16
-- Description: Populate specialty-pet category with vendor data from the specialty pet marketplace

-- Insert specialty pet vendors as businesses
INSERT INTO businesses (
    id,
    name,
    description,
    address,
    city,
    state,
    zip_code,
    phone,
    email,
    website,
    category,
    services,
    rating,
    verified,
    premium,
    status,
    site_id,
    created_at,
    updated_at
) VALUES
-- Health & Wellness Vendors
('specialty-pet-redbarn-001', 'Redbarn Pet Products', 'Premium natural dog treats, chews, and food products made with simple, wholesome ingredients.', '123 Pet Way', 'Long Beach', 'CA', '90802', '800-555-1212', 'info@redbarn.com', 'https://www.redbarn.com', 'specialty-pet', 'Health & Wellness, Dog Treats, Natural Products', 4.7, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-charlotte-002', 'Charlotte''s Web', 'Hemp-derived CBD products for pets.', '17 Hemp Highway', 'Boulder', 'CO', '80301', '800-555-0101', 'pets@charlottesweb.com', 'https://www.charlottesweb.com', 'specialty-pet', 'Health & Wellness, CBD, Hemp Products', 4.8, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-virbac-003', 'Virbac', 'Veterinary-formulated pet health products.', '18 Veterinary Drive', 'Fort Worth', 'TX', '76137', '800-555-1212', 'care@virbac.com', 'https://www.virbac.com', 'specialty-pet', 'Health & Wellness, Veterinary Products', 4.9, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Grooming Vendors
('specialty-pet-4legger-004', '4-Legger', 'Organic, all-natural pet grooming products.', '14 Organic Way', 'Tampa', 'FL', '33601', '800-555-7878', 'woof@4-legger.com', 'https://4-legger.com', 'specialty-pet', 'Grooming, Organic Products, Shampoo', 4.8, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-tropiclean-005', 'TropiClean', 'Natural pet grooming and oral care products.', '15 Fresh Boulevard', 'Wentzville', 'MO', '63385', '800-555-8989', 'fresh@tropiclean.com', 'https://tropiclean.com', 'specialty-pet', 'Grooming, Oral Care, Natural Products', 4.5, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-natural-dog-006', 'Natural Dog Company', 'Organic healing balms and skincare for dogs.', '16 Healing Path', 'Richmond', 'VA', '23219', '800-555-9090', 'heal@naturaldogcompany.com', 'https://naturaldogcompany.com', 'specialty-pet', 'Grooming, Healing Balms, Skincare', 4.7, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Training Vendors
('specialty-pet-paw5-007', 'PAW5', 'Enrichment products designed to stimulate dogs mentally and physically.', '404 Enrichment Avenue', 'Philadelphia', 'PA', '19107', '800-555-7878', 'hello@paw5.com', 'https://www.paw5.com', 'specialty-pet', 'Training, Mental Stimulation, Enrichment', 4.4, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-outward-hound-008', 'Outward Hound', 'Innovative pet products including puzzle toys, life jackets, and travel gear.', '606 Innovation Road', 'Centennial', 'CO', '80112', '800-555-9090', 'woof@outwardhound.com', 'https://outwardhound.com', 'specialty-pet', 'Training, Puzzle Toys, Interactive Products', 4.5, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-petsafe-009', 'PetSafe', 'Electronic pet training and care products.', '32 Technology Drive', 'Knoxville', 'TN', '37932', '800-555-5656', 'care@petsafe.net', 'https://www.petsafe.net', 'specialty-pet', 'Training, Electronic Products, Pet Care', 4.6, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Food & Treats Vendors
('specialty-pet-honest-kitchen-010', 'The Honest Kitchen', 'Human-grade dehydrated pet foods and treats made with whole food ingredients.', '789 Wholesome Blvd', 'San Diego', 'CA', '92101', '866-555-3434', 'support@thehonestkitchen.com', 'https://www.thehonestkitchen.com', 'specialty-pet', 'Food & Treats, Human-Grade, Dehydrated', 4.9, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-wild-earth-011', 'Wild Earth', 'Plant-based, sustainable pet food and treats for environmentally-conscious pet owners.', '101 Green Street', 'Berkeley', 'CA', '94710', '877-555-4545', 'hello@wildearth.com', 'https://wildearth.com', 'specialty-pet', 'Food & Treats, Plant-Based, Sustainable', 4.5, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-vital-essentials-012', 'Vital Essentials', 'Raw, freeze-dried pet food and treats made from single-source animal proteins.', '202 Raw Foods Lane', 'Green Bay', 'WI', '54304', '800-555-5656', 'info@vitalessentialsraw.com', 'https://www.vitalessentialsraw.com', 'specialty-pet', 'Food & Treats, Raw, Freeze-Dried', 4.6, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Travel Vendors
('specialty-pet-ruffwear-013', 'Ruffwear', 'Performance dog gear for outdoor adventures.', '11 Adventure Avenue', 'Bend', 'OR', '97701', '800-555-4545', 'bark@ruffwear.com', 'https://ruffwear.com', 'specialty-pet', 'Travel, Adventure Gear, Performance Products', 4.9, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-kurgo-014', 'Kurgo', 'Travel and outdoor gear for active dogs.', '13 Travel Terrace', 'Salisbury', 'MA', '01952', '800-555-6767', 'journey@kurgo.com', 'https://www.kurgo.com', 'specialty-pet', 'Travel, Outdoor Gear, Car Safety', 4.6, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Accessories Vendors
('specialty-pet-harry-barker-015', 'Harry Barker', 'Eco-friendly, designer pet products including toys, beds, and accessories.', '456 Eco Drive', 'Charleston', 'SC', '29401', '800-555-2323', 'hello@harrybarker.com', 'https://harrybarker.com', 'specialty-pet', 'Accessories, Eco-Friendly, Designer Products', 4.8, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-west-paw-016', 'West Paw', 'Eco-friendly, durable dog toys and beds made in the USA.', '303 Durability Drive', 'Bozeman', 'MT', '59715', '800-555-6767', 'woof@westpaw.com', 'https://www.westpaw.com', 'specialty-pet', 'Accessories, Eco-Friendly, Durable Toys', 4.8, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-hyperpet-017', 'Hyper Pet', 'Interactive toys and accessories for active pets.', '505 Active Way', 'Wichita', 'KS', '67202', '800-555-8989', 'info@hyperpet.com', 'https://hyperpet.com', 'specialty-pet', 'Accessories, Interactive Toys, Active Pets', 4.3, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-big-barker-018', 'Big Barker', 'Orthopedic beds specifically designed for large breed dogs.', '707 Comfort Lane', 'Reading', 'PA', '19601', '800-555-0101', 'sleep@bigbarker.com', 'https://bigbarker.com', 'specialty-pet', 'Accessories, Orthopedic Beds, Large Breed', 4.9, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-best-friends-019', 'Best Friends by Sheri', 'Calming pet beds and comfort products.', '808 Calming Court', 'Los Angeles', 'CA', '90001', '800-555-1212', 'hello@bestfriendsbysheri.com', 'https://bestfriendsbysheri.com', 'specialty-pet', 'Accessories, Calming Beds, Comfort Products', 4.7, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-coolaroo-020', 'Coolaroo', 'Elevated pet beds and outdoor pet products.', '909 Elevation Road', 'Melbourne', 'FL', '32904', '800-555-2323', 'info@coolaroo.com', 'https://www.coolaroo.com', 'specialty-pet', 'Accessories, Elevated Beds, Outdoor Products', 4.2, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-barbour-021', 'Barbour', 'Premium British lifestyle brand offering luxury pet accessories.', '10 Luxury Lane', 'New York', 'NY', '10001', '800-555-3434', 'pets@barbour.com', 'https://www.barbour.com', 'specialty-pet', 'Accessories, Luxury Products, British Design', 4.8, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-found-my-animal-022', 'Found My Animal', 'Handcrafted leather pet accessories with a focus on adoption awareness.', '12 Adoption Lane', 'Brooklyn', 'NY', '11201', '800-555-5656', 'woof@foundmyanimal.com', 'https://foundmyanimal.com', 'specialty-pet', 'Accessories, Handcrafted Leather, Adoption Awareness', 4.7, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Cat-Specific Vendors
('specialty-pet-petlinks-023', 'Petlinks', 'Eco-friendly cat toys and accessories.', '19 Feline Way', 'Chicago', 'IL', '60601', '800-555-2323', 'meow@petlinks.com', 'https://petlinks.com', 'specialty-pet', 'Accessories, Cat Toys, Eco-Friendly', 4.4, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-from-the-field-024', 'From The Field', 'Organic catnip and cat toys.', '20 Catnip Court', 'Seattle', 'WA', '98101', '800-555-3434', 'catnip@fromthefieldpet.com', 'https://fromthefieldpet.com', 'specialty-pet', 'Accessories, Organic Catnip, Cat Toys', 4.6, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-catastrophi-025', 'CatastrophiCreations', 'Handcrafted wall-mounted cat furniture.', '21 Climbing Wall', 'Grand Rapids', 'MI', '49503', '800-555-4545', 'meow@catastrophicreations.com', 'https://www.catastrophicreations.com', 'specialty-pet', 'Accessories, Cat Furniture, Wall-Mounted', 4.9, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-litter-robot-026', 'Litter-Robot', 'Automated pet waste management systems.', '22 Automation Avenue', 'Auburn Hills', 'MI', '48326', '800-555-5656', 'clean@litter-robot.com', 'https://www.litter-robot.com', 'specialty-pet', 'Accessories, Automated Systems, Litter Management', 4.7, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-surefeed-027', 'SureFeed', 'Microchip-activated pet feeders.', '23 Technology Terrace', 'Boston', 'MA', '02108', '800-555-6767', 'feed@surepetcare.com', 'https://www.surepetcare.com', 'specialty-pet', 'Accessories, Microchip Technology, Smart Feeders', 4.6, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-pet-greens-028', 'Pet Greens', 'Cat grass and pet greens growing kits.', '24 Garden Grove', 'San Diego', 'CA', '92101', '800-555-7878', 'grow@petgreens.com', 'https://petgreens.com', 'specialty-pet', 'Accessories, Cat Grass, Growing Kits', 4.3, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Small Animal & Exotic Pet Vendors
('specialty-pet-oxbow-029', 'Oxbow', 'Premium nutrition and care products for small animals.', '25 Small Animal Street', 'Omaha', 'NE', '68102', '800-555-8989', 'hay@oxbowanimalhealth.com', 'https://www.oxbowanimalhealth.com', 'specialty-pet', 'Food & Treats, Small Animals, Premium Nutrition', 4.8, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-kaytee-030', 'Kaytee', 'Small animal food, treats, and accessories.', '26 Small Pet Place', 'Chilton', 'WI', '53014', '800-555-9090', 'smallpets@kaytee.com', 'https://www.kaytee.com', 'specialty-pet', 'Food & Treats, Small Animals, Accessories', 4.5, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-zoo-med-031', 'Zoo Med', 'Reptile and exotic pet supplies.', '27 Reptile Road', 'San Luis Obispo', 'CA', '93401', '800-555-0101', 'reptiles@zoomed.com', 'https://zoomed.com', 'specialty-pet', 'Accessories, Reptile Supplies, Exotic Pets', 4.7, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-flukers-032', 'Fluker''s', 'Reptile and amphibian care products.', '28 Herp Highway', 'Port Allen', 'LA', '70767', '800-555-1212', 'reptiles@flukerfarms.com', 'https://flukerfarms.com', 'specialty-pet', 'Accessories, Reptile Care, Amphibian Products', 4.6, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-exotic-nutrition-033', 'Exotic Nutrition', 'Specialized diets and accessories for exotic pets.', '29 Exotic Avenue', 'Newport News', 'VA', '23608', '800-555-2323', 'exotic@exoticnutrition.com', 'https://www.exoticnutrition.com', 'specialty-pet', 'Food & Treats, Exotic Pets, Specialized Diets', 4.8, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Home & Cleaning Vendors
('specialty-pet-specialty-products-034', 'Specialty Pet Products', 'Odor control solutions for pet homes.', '30 Fresh Street', 'Portland', 'OR', '97201', '800-555-3434', 'fresh@petodorsolution.com', 'https://www.petodorsolution.com', 'specialty-pet', 'Home Care, Odor Control, Cleaning Solutions', 4.4, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-earth-rated-035', 'Earth Rated', 'Eco-friendly pet waste management products.', '31 Eco Lane', 'Montreal', 'QC', 'H4C 2G9', '800-555-4545', 'green@earthrated.com', 'https://earthrated.com', 'specialty-pet', 'Home Care, Eco-Friendly, Waste Management', 4.7, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-levoit-036', 'Levoit', 'Air purification systems for pet homes.', '33 Clean Air Court', 'Anaheim', 'CA', '92805', '800-555-6767', 'air@levoit.com', 'https://levoit.com', 'specialty-pet', 'Home Care, Air Purification, HEPA Filters', 4.5, 1, 1, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('specialty-pet-chomchom-037', 'ChomChom', 'Pet hair removal tools and cleaning solutions.', '34 Tidy Terrace', 'Houston', 'TX', '77002', '800-555-7878', 'clean@chomchom.com', 'https://chomchom.com', 'specialty-pet', 'Home Care, Hair Removal, Cleaning Tools', 4.8, 1, 0, 'active', 'specialty-pet', datetime('now'), datetime('now'));
