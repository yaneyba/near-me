-- Migration: Add specialty pet vendors to businesses table
-- Created: 2025-07-16 18:00:00
-- Description: Populate specialty pet category with vendors from product categories

INSERT INTO businesses (
    id, name, description, address, city, state, zip_code, phone, email, website,
    category, services, rating, review_count, status, site_id, created_at, updated_at
) VALUES

-- Health & Wellness Category Vendors
('sp-charlotte-web-001', 'Charlotte''s Web', 'Hemp-derived CBD products for pets.', '17 Hemp Highway', 'Boulder', 'CO', '80301', '800-555-0101', 'pets@charlottesweb.com', 'https://www.charlottesweb.com', 'specialty-pet', 'hemp, CBD, wellness, anxiety relief', 4.80, 128, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-virbac-001', 'Virbac', 'Veterinary-formulated pet health products.', '18 Veterinary Drive', 'Fort Worth', 'TX', '76137', '800-555-1212', 'care@virbac.com', 'https://www.virbac.com', 'specialty-pet', 'veterinary, health products, supplements', 4.90, 176, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-natural-dog-company-001', 'Natural Dog Company', 'Organic healing balms and skincare for dogs.', '16 Healing Path', 'Richmond', 'VA', '23219', '800-555-9090', 'heal@naturaldogcompany.com', 'https://naturaldogcompany.com', 'specialty-pet', 'organic, healing balms, skincare, paw care', 4.70, 93, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Grooming Category Vendors
('sp-4legger-001', '4-Legger', 'Organic, all-natural pet grooming products.', '14 Organic Way', 'Tampa', 'FL', '33601', '800-555-7878', 'woof@4-legger.com', 'https://4-legger.com', 'specialty-pet', 'organic grooming, natural shampoo, hypoallergenic', 4.80, 104, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-tropiclean-001', 'TropiClean', 'Natural pet grooming and oral care products.', '15 Fresh Boulevard', 'Wentzville', 'MO', '63385', '800-555-8989', 'fresh@tropiclean.com', 'https://tropiclean.com', 'specialty-pet', 'natural grooming, oral care, dental products', 4.50, 167, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Training Category Vendors
('sp-petsafe-001', 'PetSafe', 'Electronic pet training and care products.', '32 Technology Drive', 'Knoxville', 'TN', '37932', '800-555-5656', 'care@petsafe.net', 'https://www.petsafe.net', 'specialty-pet', 'electronic training, pet care technology, safety products', 4.60, 187, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-outward-hound-001', 'Outward Hound', 'Innovative pet products including puzzle toys, life jackets, and travel gear.', '606 Innovation Road', 'Centennial', 'CO', '80112', '800-555-9090', 'woof@outwardhound.com', 'https://outwardhound.com', 'specialty-pet', 'puzzle toys, training, life jackets, travel gear', 4.50, 143, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-paw5-001', 'PAW5', 'Enrichment products designed to stimulate dogs mentally and physically.', '404 Enrichment Avenue', 'Philadelphia', 'PA', '19107', '800-555-7878', 'hello@paw5.com', 'https://www.paw5.com', 'specialty-pet', 'mental stimulation, enrichment, training aids', 4.40, 68, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Food & Treats Category Vendors
('sp-redbarn-001', 'Redbarn Pet Products', 'Premium natural dog treats, chews, and food products made with simple, wholesome ingredients.', '123 Pet Way', 'Long Beach', 'CA', '90802', '800-555-1212', 'info@redbarn.com', 'https://www.redbarn.com', 'specialty-pet', 'natural treats, dog chews, premium food, dental health', 4.70, 128, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-honest-kitchen-001', 'The Honest Kitchen', 'Human-grade dehydrated pet foods and treats made with whole food ingredients.', '789 Wholesome Blvd', 'San Diego', 'CA', '92101', '866-555-3434', 'support@thehonestkitchen.com', 'https://www.thehonestkitchen.com', 'specialty-pet', 'human-grade food, dehydrated treats, whole food ingredients', 4.90, 210, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-wild-earth-001', 'Wild Earth', 'Plant-based, sustainable pet food and treats for environmentally-conscious pet owners.', '101 Green Street', 'Berkeley', 'CA', '94710', '877-555-4545', 'hello@wildearth.com', 'https://wildearth.com', 'specialty-pet', 'plant-based food, sustainable treats, eco-friendly', 4.50, 87, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-vital-essentials-001', 'Vital Essentials', 'Raw, freeze-dried pet food and treats made from single-source animal proteins.', '202 Raw Foods Lane', 'Green Bay', 'WI', '54304', '800-555-5656', 'info@vitalessentialsraw.com', 'https://www.vitalessentialsraw.com', 'specialty-pet', 'raw food, freeze-dried treats, single-source protein', 4.60, 112, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Travel Category Vendors
('sp-ruffwear-001', 'Ruffwear', 'Performance dog gear for outdoor adventures.', '11 Adventure Avenue', 'Bend', 'OR', '97701', '800-555-4545', 'bark@ruffwear.com', 'https://ruffwear.com', 'specialty-pet', 'performance gear, outdoor adventures, harnesses, travel', 4.90, 215, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-kurgo-001', 'Kurgo', 'Travel and outdoor gear for active dogs.', '13 Travel Terrace', 'Salisbury', 'MA', '01952', '800-555-6767', 'journey@kurgo.com', 'https://www.kurgo.com', 'specialty-pet', 'travel gear, outdoor equipment, car safety, active dogs', 4.60, 132, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Accessories Category Vendors
('sp-harry-barker-001', 'Harry Barker', 'Eco-friendly, designer pet products including toys, beds, and accessories.', '456 Eco Drive', 'Charleston', 'SC', '29401', '800-555-2323', 'hello@harrybarker.com', 'https://harrybarker.com', 'specialty-pet', 'eco-friendly accessories, designer products, toys, beds', 4.80, 95, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-west-paw-001', 'West Paw', 'Eco-friendly, durable dog toys and beds made in the USA.', '303 Durability Drive', 'Bozeman', 'MT', '59715', '800-555-6767', 'woof@westpaw.com', 'https://www.westpaw.com', 'specialty-pet', 'eco-friendly toys, durable products, made in USA, beds', 4.80, 156, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-found-my-animal-001', 'Found My Animal', 'Handcrafted leather pet accessories with a focus on adoption awareness.', '12 Adoption Lane', 'Brooklyn', 'NY', '11201', '800-555-5656', 'woof@foundmyanimal.com', 'https://foundmyanimal.com', 'specialty-pet', 'handcrafted leather, accessories, adoption awareness', 4.70, 89, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-barbour-001', 'Barbour', 'Premium British lifestyle brand offering luxury pet accessories.', '10 Luxury Lane', 'New York', 'NY', '10001', '800-555-3434', 'pets@barbour.com', 'https://www.barbour.com', 'specialty-pet', 'luxury accessories, premium products, British design', 4.80, 76, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Additional Premium Vendors
('sp-big-barker-001', 'Big Barker', 'Orthopedic beds specifically designed for large breed dogs.', '707 Comfort Lane', 'Reading', 'PA', '19601', '800-555-0101', 'sleep@bigbarker.com', 'https://bigbarker.com', 'specialty-pet', 'orthopedic beds, large breed, comfort, memory foam', 4.90, 187, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-best-friends-001', 'Best Friends by Sheri', 'Calming pet beds and comfort products.', '808 Calming Court', 'Los Angeles', 'CA', '90001', '800-555-1212', 'hello@bestfriendsbysheri.com', 'https://bestfriendsbysheri.com', 'specialty-pet', 'calming beds, comfort products, anxiety relief', 4.70, 124, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-hyper-pet-001', 'Hyper Pet', 'Interactive toys and accessories for active pets.', '505 Active Way', 'Wichita', 'KS', '67202', '800-555-8989', 'info@hyperpet.com', 'https://hyperpet.com', 'specialty-pet', 'interactive toys, active pets, accessories', 4.30, 79, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Cat Specialty Vendors
('sp-catastrophicreations-001', 'CatastrophiCreations', 'Handcrafted wall-mounted cat furniture.', '21 Climbing Wall', 'Grand Rapids', 'MI', '49503', '800-555-4545', 'meow@catastrophicreations.com', 'https://www.catastrophicreations.com', 'specialty-pet', 'wall-mounted furniture, handcrafted, cat trees', 4.90, 156, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-litter-robot-001', 'Litter-Robot', 'Automated pet waste management systems.', '22 Automation Avenue', 'Auburn Hills', 'MI', '48326', '800-555-5656', 'clean@litter-robot.com', 'https://www.litter-robot.com', 'specialty-pet', 'automated litter boxes, waste management, technology', 4.70, 198, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-surefeed-001', 'SureFeed', 'Microchip-activated pet feeders.', '23 Technology Terrace', 'Boston', 'MA', '02108', '800-555-6767', 'feed@surepetcare.com', 'https://www.surepetcare.com', 'specialty-pet', 'microchip feeders, selective feeding, technology', 4.60, 112, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-petlinks-001', 'Petlinks', 'Eco-friendly cat toys and accessories.', '19 Feline Way', 'Chicago', 'IL', '60601', '800-555-2323', 'meow@petlinks.com', 'https://petlinks.com', 'specialty-pet', 'eco-friendly cat toys, accessories, sustainable', 4.40, 87, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-from-the-field-001', 'From The Field', 'Organic catnip and cat toys.', '20 Catnip Court', 'Seattle', 'WA', '98101', '800-555-3434', 'catnip@fromthefieldpet.com', 'https://fromthefieldpet.com', 'specialty-pet', 'organic catnip, cat toys, natural products', 4.60, 72, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-pet-greens-001', 'Pet Greens', 'Cat grass and pet greens growing kits.', '24 Garden Grove', 'San Diego', 'CA', '92101', '800-555-7878', 'grow@petgreens.com', 'https://petgreens.com', 'specialty-pet', 'cat grass, growing kits, pet greens', 4.30, 64, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Small Animal & Exotic Pet Vendors
('sp-oxbow-001', 'Oxbow', 'Premium nutrition and care products for small animals.', '25 Small Animal Street', 'Omaha', 'NE', '68102', '800-555-8989', 'hay@oxbowanimalhealth.com', 'https://www.oxbowanimalhealth.com', 'specialty-pet', 'small animal nutrition, hay, premium care products', 4.80, 143, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-kaytee-001', 'Kaytee', 'Small animal food, treats, and accessories.', '26 Small Pet Place', 'Chilton', 'WI', '53014', '800-555-9090', 'smallpets@kaytee.com', 'https://www.kaytee.com', 'specialty-pet', 'small animal food, treats, accessories, bedding', 4.50, 109, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-zoo-med-001', 'Zoo Med', 'Reptile and exotic pet supplies.', '27 Reptile Road', 'San Luis Obispo', 'CA', '93401', '800-555-0101', 'reptiles@zoomed.com', 'https://zoomed.com', 'specialty-pet', 'reptile supplies, exotic pets, terrariums, heating', 4.70, 132, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-flukers-001', 'Fluker''s', 'Reptile and amphibian care products.', '28 Herp Highway', 'Port Allen', 'LA', '70767', '800-555-1212', 'reptiles@flukerfarms.com', 'https://flukerfarms.com', 'specialty-pet', 'reptile care, amphibian products, habitat supplies', 4.60, 87, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-exotic-nutrition-001', 'Exotic Nutrition', 'Specialized diets and accessories for exotic pets.', '29 Exotic Avenue', 'Newport News', 'VA', '23608', '800-555-2323', 'exotic@exoticnutrition.com', 'https://www.exoticnutrition.com', 'specialty-pet', 'exotic pet diets, specialized nutrition, accessories', 4.80, 76, 'active', 'specialty-pet', datetime('now'), datetime('now')),

-- Home & Cleaning Vendors
('sp-specialty-pet-products-001', 'Specialty Pet Products', 'Odor control solutions for pet homes.', '30 Fresh Street', 'Portland', 'OR', '97201', '800-555-3434', 'fresh@petodorsolution.com', 'https://www.petodorsolution.com', 'specialty-pet', 'odor control, home solutions, cleaning products', 4.40, 64, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-earth-rated-001', 'Earth Rated', 'Eco-friendly pet waste management products.', '31 Eco Lane', 'Montreal', 'QC', 'H4C 2G9', '800-555-4545', 'green@earthrated.com', 'https://earthrated.com', 'specialty-pet', 'eco-friendly waste bags, waste management, biodegradable', 4.70, 156, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-levoit-001', 'Levoit', 'Air purification systems for pet homes.', '33 Clean Air Court', 'Anaheim', 'CA', '92805', '800-555-6767', 'air@levoit.com', 'https://levoit.com', 'specialty-pet', 'air purifiers, pet dander, home air quality', 4.50, 143, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-chomchom-001', 'ChomChom', 'Pet hair removal tools and cleaning solutions.', '34 Tidy Terrace', 'Houston', 'TX', '77002', '800-555-7878', 'clean@chomchom.com', 'https://chomchom.com', 'specialty-pet', 'pet hair removal, cleaning tools, reusable products', 4.80, 98, 'active', 'specialty-pet', datetime('now'), datetime('now')),

('sp-coolaroo-001', 'Coolaroo', 'Elevated pet beds and outdoor pet products.', '909 Elevation Road', 'Melbourne', 'FL', '32904', '800-555-2323', 'info@coolaroo.com', 'https://www.coolaroo.com', 'specialty-pet', 'elevated beds, outdoor products, cooling beds', 4.20, 98, 'active', 'specialty-pet', datetime('now'), datetime('now'));
