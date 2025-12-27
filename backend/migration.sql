ALTER TABLE maintenance_requests 
ADD COLUMN created_by BIGINT NULL AFTER subject,
ADD COLUMN category_id BIGINT NULL AFTER equipment_id,
ADD COLUMN request_date DATE NULL AFTER category_id,
ADD COLUMN maintenance_type ENUM('Corrective', 'Preventive') DEFAULT 'Corrective' AFTER request_date,
ADD COLUMN team_id BIGINT NULL AFTER maintenance_type,
ADD COLUMN technician_id BIGINT NULL AFTER team_id,
ADD COLUMN scheduled_date DATE NULL AFTER technician_id,
ADD COLUMN duration INT NULL AFTER scheduled_date,
ADD COLUMN company_id BIGINT NULL AFTER status_id,
ADD COLUMN notes TEXT NULL AFTER company_id,
ADD COLUMN instructions TEXT NULL AFTER notes;

ALTER TABLE maintenance_requests
MODIFY COLUMN priority ENUM('Low', 'Medium', 'High') DEFAULT 'Low';

ALTER TABLE maintenance_requests
ADD FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD FOREIGN KEY (category_id) REFERENCES equipment_categories(id) ON DELETE SET NULL,
ADD FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
ADD FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL,
ADD FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

