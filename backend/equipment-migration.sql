ALTER TABLE equipment 
ADD COLUMN employee_id BIGINT NULL AFTER work_center_id,
ADD COLUMN department VARCHAR(255) NULL AFTER employee_id,
ADD COLUMN technician_id BIGINT NULL AFTER department,
ADD COLUMN company_id BIGINT NULL AFTER technician_id;

ALTER TABLE equipment
ADD FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE SET NULL,
ADD FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL,
ADD FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

