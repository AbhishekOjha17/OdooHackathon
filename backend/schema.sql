-- GearGuard CMMS Database Schema

CREATE DATABASE IF NOT EXISTS gearguard;
USE gearguard;

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee', 'technician') NOT NULL,
  company_id BIGINT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

-- Equipment categories table
CREATE TABLE IF NOT EXISTS equipment_categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);

-- Work centers table
CREATE TABLE IF NOT EXISTS work_centers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255),
  category_id BIGINT,
  work_center_id BIGINT,
  FOREIGN KEY (category_id) REFERENCES equipment_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (work_center_id) REFERENCES work_centers(id) ON DELETE SET NULL
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  team_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  PRIMARY KEY (team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Maintenance status table
CREATE TABLE IF NOT EXISTS maintenance_status (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);

-- Insert default maintenance status values
INSERT INTO maintenance_status (name) VALUES 
  ('New'),
  ('In Progress'),
  ('Repaired'),
  ('Scrap')
ON DUPLICATE KEY UPDATE name = name;

-- Maintenance requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  subject VARCHAR(255) NOT NULL,
  equipment_id BIGINT,
  status_id BIGINT,
  priority VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE SET NULL,
  FOREIGN KEY (status_id) REFERENCES maintenance_status(id) ON DELETE SET NULL
);

