USE h5_cloud_db;

ALTER TABLE verification_codes
MODIFY COLUMN type ENUM('LOGIN', 'REGISTER', 'RESET_PASSWORD') NOT NULL DEFAULT 'LOGIN';