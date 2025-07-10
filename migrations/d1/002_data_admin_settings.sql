
-- Data migration for admin_settings
-- Migrated 2 rows from Supabase

INSERT INTO admin_settings (id, setting_key, setting_value, description, created_at, updated_at) VALUES ('82717f1c-41d8-4860-9014-4d7cb07ab6d7', 'login_enabled', '1', 'Enable or disable user login functionality', '2025-06-27T13:34:41.424Z', '2025-06-27T13:34:41.424Z');
INSERT INTO admin_settings (id, setting_key, setting_value, description, created_at, updated_at) VALUES ('3ff06cd0-59cc-4f02-9944-83408d7ce668', 'tracking_enabled', '1', 'Enable or disable user engagement tracking', '2025-06-27T13:34:41.424Z', '2025-06-27T14:32:11.682Z');
