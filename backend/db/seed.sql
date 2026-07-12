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
-- Hash for 'Password123!' -> $2b$10$Wp.uR.s6.c.T/3Z6.K/Q.O663vL5N4.9v4G.B3P2O1n/hO/Q4V8hO 
INSERT INTO users (name, email, password_hash, role_id) VALUES
('Fleet Manager User', 'fleetmanager@transitops.in', '$2a$12$Kk2950J7T9/0nS6n3U5wLe.V/j56hQx7H9M2mYjK9X/g6/07l6mG.', 1),
('Dispatcher User', 'dispatcher@transitops.in', '$2a$12$Kk2950J7T9/0nS6n3U5wLe.V/j56hQx7H9M2mYjK9X/g6/07l6mG.', 2),
('Safety Officer User', 'safetyofficer@transitops.in', '$2a$12$Kk2950J7T9/0nS6n3U5wLe.V/j56hQx7H9M2mYjK9X/g6/07l6mG.', 3),
('Financial Analyst User', 'financialanalyst@transitops.in', '$2a$12$Kk2950J7T9/0nS6n3U5wLe.V/j56hQx7H9M2mYjK9X/g6/07l6mG.', 4);

-- Insert Default Settings
INSERT INTO settings (depot_name, currency, distance_unit) VALUES
('Gandhinagar Depot', 'INR (₹)', 'Kilometers');
