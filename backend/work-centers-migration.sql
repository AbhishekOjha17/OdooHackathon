ALTER TABLE work_centers 
ADD COLUMN code VARCHAR(255) NULL AFTER name,
ADD COLUMN tag VARCHAR(255) NULL AFTER code,
ADD COLUMN alternative_workcenter_id BIGINT NULL AFTER tag,
ADD COLUMN cost_per_hour DECIMAL(10,2) NULL AFTER alternative_workcenter_id,
ADD COLUMN capacity VARCHAR(255) NULL AFTER cost_per_hour,
ADD COLUMN time_efficiency DECIMAL(5,2) NULL AFTER capacity,
ADD COLUMN oee_target DECIMAL(5,2) NULL AFTER time_efficiency;

ALTER TABLE work_centers
ADD FOREIGN KEY (alternative_workcenter_id) REFERENCES work_centers(id) ON DELETE SET NULL;

