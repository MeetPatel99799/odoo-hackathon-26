-- Insert Roles
INSERT INTO roles (id, name) VALUES 
(1, 'Fleet Manager'),
(2, 'Dispatcher'),
(3, 'Safety Officer'),
(4, 'Financial Analyst')
ON CONFLICT DO NOTHING;

-- Insert Role Permissions
-- Fleet Manager: Full Write Access
INSERT INTO role_permissions (role_id, module, access_level) VALUES 
(1, 'vehicles', 'Write'),
(1, 'drivers', 'Write'),
(1, 'trips', 'Write'),
(1, 'maintenance', 'Write'),
(1, 'expenses', 'Write'),
(1, 'users', 'Write'),
(1, 'settings', 'Write');

-- Dispatcher: Write on trips, Read on vehicles & drivers
INSERT INTO role_permissions (role_id, module, access_level) VALUES 
(2, 'trips', 'Write'),
(2, 'vehicles', 'Read'),
(2, 'drivers', 'Read');

-- Safety Officer: Write on drivers, Read on trips & vehicles
INSERT INTO role_permissions (role_id, module, access_level) VALUES 
(3, 'drivers', 'Write'),
(3, 'trips', 'Read'),
(3, 'vehicles', 'Read');

-- Financial Analyst: Write on expenses, Read on trips, vehicles, maintenance
INSERT INTO role_permissions (role_id, module, access_level) VALUES 
(4, 'expenses', 'Write'),
(4, 'trips', 'Read'),
(4, 'vehicles', 'Read'),
(4, 'maintenance', 'Read');

-- Insert demo users for each role (Password is 'Password123!')
INSERT INTO users (name, email, password_hash, role_id) VALUES
('Fleet Manager User', 'fleetmanager@transitops.in', '$2b$10$cqPzPZKctGKyI5ZTUHA4EOvfQbTFAFbArGIPKcHIe2xvZyLCnYz4y', 1),
('Dispatcher User', 'dispatcher@transitops.in', '$2b$10$cqPzPZKctGKyI5ZTUHA4EOvfQbTFAFbArGIPKcHIe2xvZyLCnYz4y', 2),
('Safety Officer User', 'safetyofficer@transitops.in', '$2b$10$cqPzPZKctGKyI5ZTUHA4EOvfQbTFAFbArGIPKcHIe2xvZyLCnYz4y', 3),
('Financial Analyst User', 'financialanalyst@transitops.in', '$2b$10$cqPzPZKctGKyI5ZTUHA4EOvfQbTFAFbArGIPKcHIe2xvZyLCnYz4y', 4);

-- Insert Default Settings
INSERT INTO settings (depot_name, currency, distance_unit) VALUES
('Gandhinagar Depot', 'INR (₹)', 'Kilometers');