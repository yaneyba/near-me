-- Fix water station IDs to be cleaner and shorter
-- From: water-refill-sf-001-sfo-water-filling-station
-- To: sf-001

UPDATE businesses SET 
  id = 'sf-001',
  business_id = 'sf-001'
WHERE id = 'water-refill-sf-001-sfo-water-filling-station';

UPDATE businesses SET 
  id = 'sf-002', 
  business_id = 'sf-002'
WHERE id = 'water-refill-sf-002-aqua-spring';

UPDATE businesses SET 
  id = 'sf-003',
  business_id = 'sf-003' 
WHERE id = 'water-refill-sf-003-primo-water-refill';

UPDATE businesses SET 
  id = 'sf-004',
  business_id = 'sf-004'
WHERE id = 'water-refill-sf-004-primo-water-refill';

UPDATE businesses SET 
  id = 'sf-005',
  business_id = 'sf-005'
WHERE id = 'water-refill-sf-005-primo-water-refill';
