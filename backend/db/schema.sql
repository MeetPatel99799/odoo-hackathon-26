CREATE TABLE roles (

  id SERIAL PRIMARY KEY,

  name VARCHAR(30) UNIQUE NOT NULL

);

CREATE TABLE users (

  id SERIAL PRIMARY KEY,

  name VARCHAR(100) NOT NULL,

  email VARCHAR(150) UNIQUE NOT NULL,

  password_hash VARCHAR(255) NOT NULL,

  role_id INTEGER REFERENCES roles(id),

  failed_login_attempts INTEGER DEFAULT 0,

  locked_until TIMESTAMP NULL,

  created_at TIMESTAMP DEFAULT NOW(),

  updated_at TIMESTAMP DEFAULT NOW()

);

CREATE TABLE role_permissions (

  id SERIAL PRIMARY KEY,

  role_id INTEGER REFERENCES roles(id),

  module VARCHAR(30) NOT NULL,

  access_level VARCHAR(10) NOT NULL

);

CREATE TABLE vehicles (

  id SERIAL PRIMARY KEY,

  reg_no VARCHAR(30) UNIQUE NOT NULL,

  name_model VARCHAR(50) NOT NULL,

  type VARCHAR(20) NOT NULL,

  max_capacity_kg NUMERIC(10,2) NOT NULL,

  odometer NUMERIC(10,2) DEFAULT 0,

  acquisition_cost NUMERIC(12,2) NOT NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'Available',

  region VARCHAR(50),

  created_at TIMESTAMP DEFAULT NOW(),

  updated_at TIMESTAMP DEFAULT NOW()

);

CREATE TABLE drivers (

  id SERIAL PRIMARY KEY,

  name VARCHAR(100) NOT NULL,

  license_no VARCHAR(30) UNIQUE NOT NULL,

  license_category VARCHAR(10) NOT NULL,

  license_expiry DATE NOT NULL,

  contact_number VARCHAR(20),

  safety_score INTEGER DEFAULT 100,

  trip_completion_pct INTEGER DEFAULT 100,

  status VARCHAR(20) NOT NULL DEFAULT 'Available',

  created_at TIMESTAMP DEFAULT NOW(),

  updated_at TIMESTAMP DEFAULT NOW()

);

CREATE TABLE trips (

  id SERIAL PRIMARY KEY,

  trip_code VARCHAR(20) UNIQUE NOT NULL,

  source VARCHAR(100) NOT NULL,

  destination VARCHAR(100) NOT NULL,

  vehicle_id INTEGER REFERENCES vehicles(id),

  driver_id INTEGER REFERENCES drivers(id),

  cargo_weight_kg NUMERIC(10,2) NOT NULL,

  planned_distance_km NUMERIC(10,2) NOT NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'Draft',

  eta VARCHAR(50),

  final_odometer NUMERIC(10,2),

  fuel_consumed_liters NUMERIC(10,2),

  dispatched_at TIMESTAMP,

  completed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),

  updated_at TIMESTAMP DEFAULT NOW()

);

CREATE TABLE maintenance_logs (

  id SERIAL PRIMARY KEY,

  vehicle_id INTEGER REFERENCES vehicles(id),

  service_type VARCHAR(100) NOT NULL,

  cost NUMERIC(12,2) NOT NULL,

  service_date DATE NOT NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'In Shop',

  created_at TIMESTAMP DEFAULT NOW(),

  updated_at TIMESTAMP DEFAULT NOW()

);

CREATE TABLE fuel_logs (

  id SERIAL PRIMARY KEY,

  vehicle_id INTEGER REFERENCES vehicles(id),

  trip_id INTEGER REFERENCES trips(id) NULL,

  log_date DATE NOT NULL,

  liters NUMERIC(10,2) NOT NULL,

  cost NUMERIC(12,2) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()

);

CREATE TABLE expenses (

  id SERIAL PRIMARY KEY,

  trip_id INTEGER REFERENCES trips(id) NULL,

  vehicle_id INTEGER REFERENCES vehicles(id),

  toll NUMERIC(12,2) DEFAULT 0,

  other NUMERIC(12,2) DEFAULT 0,

  maintenance_linked_id INTEGER REFERENCES maintenance_logs(id) NULL,

  status VARCHAR(20) DEFAULT 'Available',

  created_at TIMESTAMP DEFAULT NOW()

);

CREATE TABLE settings (

  id SERIAL PRIMARY KEY,

  depot_name VARCHAR(100) DEFAULT 'Gandhinagar Depot',

  currency VARCHAR(10) DEFAULT 'INR (₹)',

  distance_unit VARCHAR(20) DEFAULT 'Kilometers',

  updated_at TIMESTAMP DEFAULT NOW()

);
