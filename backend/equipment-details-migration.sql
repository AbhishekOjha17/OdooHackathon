ALTER TABLE equipment 
ADD COLUMN maintenance_team_id BIGINT NULL AFTER company_id,
ADD COLUMN assigned_date DATE NULL AFTER maintenance_team_id,
ADD COLUMN scrap_date DATE NULL AFTER assigned_date,
ADD COLUMN used_in_location VARCHAR(255) NULL AFTER scrap_date,
ADD COLUMN description TEXT NULL AFTER used_in_location;

ALTER TABLE equipment
ADD FOREIGN KEY (maintenance_team_id) REFERENCES teams(id) ON DELETE SET NULL;

