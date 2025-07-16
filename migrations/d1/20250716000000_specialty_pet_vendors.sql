-- Migration: Add specialty pet vendors as businesses
-- Date: 2025-07-16
-- Description: Populate specialty pet category with vendor data

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
    rating,
    review_count,
    verified,
    premium,
    status,
    created_at,
    updated_at
) VALUES
-- Redbarn Pet Products
('79857c0b-70a8-4644-b1c1-1b3bca8f922a', 'Redbarn Pet Products', 'Premium natural dog treats, chews, and food products made with simple, wholesome ingredients.', '123 Pet Way', 'Long Beach', 'CA', '90802', '800-555-1212', 'info@redbarn.com', 'https://www.redbarn.com', 'specialty-pet', 4.7, 128, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Harry Barker
('d864ee02-93bc-4efd-aff5-19741e8185c8', 'Harry Barker', 'Eco-friendly, designer pet products including toys, beds, and accessories.', '456 Eco Drive', 'Charleston', 'SC', '29401', '800-555-2323', 'hello@harrybarker.com', 'https://harrybarker.com', 'specialty-pet', 4.8, 95, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- The Honest Kitchen
('ffdd84c5-3bba-4394-8887-f0813e516f9b', 'The Honest Kitchen', 'Human-grade dehydrated pet foods and treats made with whole food ingredients.', '789 Wholesome Blvd', 'San Diego', 'CA', '92101', '866-555-3434', 'support@thehonestkitchen.com', 'https://www.thehonestkitchen.com', 'specialty-pet', 4.9, 210, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Wild Earth
('6e12747a-6b4d-46d1-b783-9437b19825a5', 'Wild Earth', 'Plant-based, sustainable pet food and treats for environmentally-conscious pet owners.', '101 Green Street', 'Berkeley', 'CA', '94710', '877-555-4545', 'hello@wildearth.com', 'https://wildearth.com', 'specialty-pet', 4.5, 87, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Vital Essentials
('2326ad9d-eb7f-475f-a31d-f9084cbd4395', 'Vital Essentials', 'Raw, freeze-dried pet food and treats made from single-source animal proteins.', '202 Raw Foods Lane', 'Green Bay', 'WI', '54304', '800-555-5656', 'info@vitalessentialsraw.com', 'https://www.vitalessentialsraw.com', 'specialty-pet', 4.6, 112, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- West Paw
('f9fbaed6-f028-4036-b924-f8a9e88c311e', 'West Paw', 'Eco-friendly, durable dog toys and beds made in the USA.', '303 Durability Drive', 'Bozeman', 'MT', '59715', '800-555-6767', 'woof@westpaw.com', 'https://www.westpaw.com', 'specialty-pet', 4.8, 156, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- PAW5
('e019430e-8519-4216-9938-d7e18d4f3c80', 'PAW5', 'Enrichment products designed to stimulate dogs mentally and physically.', '404 Enrichment Avenue', 'Philadelphia', 'PA', '19107', '800-555-7878', 'hello@paw5.com', 'https://www.paw5.com', 'specialty-pet', 4.4, 68, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Hyper Pet
('f4859167-a101-4591-b9f3-3e3108b28ff7', 'Hyper Pet', 'Interactive toys and accessories for active pets.', '505 Active Way', 'Wichita', 'KS', '67202', '800-555-8989', 'info@hyperpet.com', 'https://hyperpet.com', 'specialty-pet', 4.3, 79, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Outward Hound
('ee37f3f4-b83c-461b-8643-8d045ebc0352', 'Outward Hound', 'Innovative pet products including puzzle toys, life jackets, and travel gear.', '606 Innovation Road', 'Centennial', 'CO', '80112', '800-555-9090', 'woof@outwardhound.com', 'https://outwardhound.com', 'specialty-pet', 4.5, 143, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Big Barker
('a4c43197-a391-4999-bbd9-65ddfa0c338a', 'Big Barker', 'Orthopedic beds specifically designed for large breed dogs.', '707 Comfort Lane', 'Reading', 'PA', '19601', '800-555-0101', 'sleep@bigbarker.com', 'https://bigbarker.com', 'specialty-pet', 4.9, 187, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Best Friends by Sheri
('236c9eb4-db20-4026-8f5c-c2cf223c0349', 'Best Friends by Sheri', 'Calming pet beds and comfort products.', '808 Calming Court', 'Los Angeles', 'CA', '90001', '800-555-1212', 'hello@bestfriendsbysheri.com', 'https://bestfriendsbysheri.com', 'specialty-pet', 4.7, 124, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Coolaroo
('23cd2ec1-d608-4737-be96-2e8773230c9f', 'Coolaroo', 'Elevated pet beds and outdoor pet products.', '909 Elevation Road', 'Melbourne', 'FL', '32904', '800-555-2323', 'info@coolaroo.com', 'https://www.coolaroo.com', 'specialty-pet', 4.2, 98, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Barbour
('ffac8189-b163-4e33-9b67-11dafe332b74', 'Barbour', 'Premium British lifestyle brand offering luxury pet accessories.', '10 Luxury Lane', 'New York', 'NY', '10001', '800-555-3434', 'pets@barbour.com', 'https://www.barbour.com', 'specialty-pet', 4.8, 76, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Ruffwear
('9c97a0f1-c65b-4ff0-b9c7-6e12c4bb2a55', 'Ruffwear', 'Performance dog gear for outdoor adventures.', '11 Adventure Avenue', 'Bend', 'OR', '97701', '800-555-4545', 'bark@ruffwear.com', 'https://ruffwear.com', 'specialty-pet', 4.9, 215, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Found My Animal
('bef3469c-85fb-4686-9c1f-1f192bbbfd8a', 'Found My Animal', 'Handcrafted leather pet accessories with a focus on adoption awareness.', '12 Adoption Lane', 'Brooklyn', 'NY', '11201', '800-555-5656', 'woof@foundmyanimal.com', 'https://foundmyanimal.com', 'specialty-pet', 4.7, 89, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Kurgo
('78fdbffd-722e-41d3-8282-f30a8da6d099', 'Kurgo', 'Travel and outdoor gear for active dogs.', '13 Travel Terrace', 'Salisbury', 'MA', '01952', '800-555-6767', 'journey@kurgo.com', 'https://www.kurgo.com', 'specialty-pet', 4.6, 132, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- 4-Legger
('795dad9a-8621-4068-a735-d84e028d8106', '4-Legger', 'Organic, all-natural pet grooming products.', '14 Organic Way', 'Tampa', 'FL', '33601', '800-555-7878', 'woof@4-legger.com', 'https://4-legger.com', 'specialty-pet', 4.8, 104, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- TropiClean
('6b963a89-7a7e-4f86-956a-037e56fad1b8', 'TropiClean', 'Natural pet grooming and oral care products.', '15 Fresh Boulevard', 'Wentzville', 'MO', '63385', '800-555-8989', 'fresh@tropiclean.com', 'https://tropiclean.com', 'specialty-pet', 4.5, 167, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Natural Dog Company
('d50e8489-5c17-4241-aec2-5fd95dac90ae', 'Natural Dog Company', 'Organic healing balms and skincare for dogs.', '16 Healing Path', 'Richmond', 'VA', '23219', '800-555-9090', 'heal@naturaldogcompany.com', 'https://naturaldogcompany.com', 'specialty-pet', 4.7, 93, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Charlotte's Web
('7e23b3f3-8175-40bc-b5d7-dcb192f7c859', 'Charlotte''s Web', 'Hemp-derived CBD products for pets.', '17 Hemp Highway', 'Boulder', 'CO', '80301', '800-555-0101', 'pets@charlottesweb.com', 'https://www.charlottesweb.com', 'specialty-pet', 4.8, 128, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Virbac
('b4e6a3f5-9520-4cc0-bad7-91676e092ae3', 'Virbac', 'Veterinary-formulated pet health products.', '18 Veterinary Drive', 'Fort Worth', 'TX', '76137', '800-555-1212', 'care@virbac.com', 'https://www.virbac.com', 'specialty-pet', 4.9, 176, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Petlinks
('dfc041c4-93a3-4d81-9940-38d25b154cdd', 'Petlinks', 'Eco-friendly cat toys and accessories.', '19 Feline Way', 'Chicago', 'IL', '60601', '800-555-2323', 'meow@petlinks.com', 'https://petlinks.com', 'specialty-pet', 4.4, 87, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- From The Field
('73db9e54-fe02-4826-afc9-2a4e17e68c78', 'From The Field', 'Organic catnip and cat toys.', '20 Catnip Court', 'Seattle', 'WA', '98101', '800-555-3434', 'catnip@fromthefieldpet.com', 'https://fromthefieldpet.com', 'specialty-pet', 4.6, 72, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- CatastrophiCreations
('1fc15a61-2821-4e99-ae50-1321a4b5d5ef', 'CatastrophiCreations', 'Handcrafted wall-mounted cat furniture.', '21 Climbing Wall', 'Grand Rapids', 'MI', '49503', '800-555-4545', 'meow@catastrophicreations.com', 'https://www.catastrophicreations.com', 'specialty-pet', 4.9, 156, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Litter-Robot
('b7caabaa-9ecc-4a36-bd02-e408b7b04618', 'Litter-Robot', 'Automated pet waste management systems.', '22 Automation Avenue', 'Auburn Hills', 'MI', '48326', '800-555-5656', 'clean@litter-robot.com', 'https://www.litter-robot.com', 'specialty-pet', 4.7, 198, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- SureFeed
('54a511dc-c292-4613-b50e-3c2257fb93b0', 'SureFeed', 'Microchip-activated pet feeders.', '23 Technology Terrace', 'Boston', 'MA', '02108', '800-555-6767', 'feed@surepetcare.com', 'https://www.surepetcare.com', 'specialty-pet', 4.6, 112, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Pet Greens
('8be9cde6-b572-4844-aeab-9e5636e6f028', 'Pet Greens', 'Cat grass and pet greens growing kits.', '24 Garden Grove', 'San Diego', 'CA', '92101', '800-555-7878', 'grow@petgreens.com', 'https://petgreens.com', 'specialty-pet', 4.3, 64, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Oxbow
('5ff79b55-dffb-4f13-8ae0-4401b84e5d90', 'Oxbow', 'Premium nutrition and care products for small animals.', '25 Small Animal Street', 'Omaha', 'NE', '68102', '800-555-8989', 'hay@oxbowanimalhealth.com', 'https://www.oxbowanimalhealth.com', 'specialty-pet', 4.8, 143, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Kaytee
('fd2a08ff-a464-45a0-8202-5dad3e6da62a', 'Kaytee', 'Small animal food, treats, and accessories.', '26 Small Pet Place', 'Chilton', 'WI', '53014', '800-555-9090', 'smallpets@kaytee.com', 'https://www.kaytee.com', 'specialty-pet', 4.5, 109, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Zoo Med
('f098119a-cf2b-4d5c-aba8-9158f8a45996', 'Zoo Med', 'Reptile and exotic pet supplies.', '27 Reptile Road', 'San Luis Obispo', 'CA', '93401', '800-555-0101', 'reptiles@zoomed.com', 'https://zoomed.com', 'specialty-pet', 4.7, 132, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Fluker's
('7a3d34a9-d99c-43f3-94af-025b3b878d04', 'Fluker''s', 'Reptile and amphibian care products.', '28 Herp Highway', 'Port Allen', 'LA', '70767', '800-555-1212', 'reptiles@flukerfarms.com', 'https://flukerfarms.com', 'specialty-pet', 4.6, 87, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Exotic Nutrition
('998a90f1-5917-47bf-868c-95b341d5526e', 'Exotic Nutrition', 'Specialized diets and accessories for exotic pets.', '29 Exotic Avenue', 'Newport News', 'VA', '23608', '800-555-2323', 'exotic@exoticnutrition.com', 'https://www.exoticnutrition.com', 'specialty-pet', 4.8, 76, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Specialty Pet Products
('f4de02f5-46a5-4f47-b0a9-8e15dd060710', 'Specialty Pet Products', 'Odor control solutions for pet homes.', '30 Fresh Street', 'Portland', 'OR', '97201', '800-555-3434', 'fresh@petodorsolution.com', 'https://www.petodorsolution.com', 'specialty-pet', 4.4, 64, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Earth Rated
('85a72a58-f2b9-46ab-8090-038e9f4e1aab', 'Earth Rated', 'Eco-friendly pet waste management products.', '31 Eco Lane', 'Montreal', 'QC', 'H4C 2G9', '800-555-4545', 'green@earthrated.com', 'https://earthrated.com', 'specialty-pet', 4.7, 156, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- PetSafe
('2618ed3d-a04b-4f86-af68-d0bd65000b74', 'PetSafe', 'Electronic pet training and care products.', '32 Technology Drive', 'Knoxville', 'TN', '37932', '800-555-5656', 'care@petsafe.net', 'https://www.petsafe.net', 'specialty-pet', 4.6, 187, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- Levoit
('e6b86ead-6758-44fe-bcc5-f41bbe61bef7', 'Levoit', 'Air purification systems for pet homes.', '33 Clean Air Court', 'Anaheim', 'CA', '92805', '800-555-6767', 'air@levoit.com', 'https://levoit.com', 'specialty-pet', 4.5, 143, 1, 1, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47'),

-- ChomChom
('2195728b-034c-49d2-90ba-f2a657b045ce', 'ChomChom', 'Pet hair removal tools and cleaning solutions.', '34 Tidy Terrace', 'Houston', 'TX', '77002', '800-555-7878', 'clean@chomchom.com', 'https://chomchom.com', 'specialty-pet', 4.8, 98, 1, 0, 'active', '2025-06-03 04:09:47', '2025-06-03 04:09:47');
