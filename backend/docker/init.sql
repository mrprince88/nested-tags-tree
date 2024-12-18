-- Enable remote root login and grant full privileges
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'rootpassword';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- Ensure local root access
CREATE USER IF NOT EXISTS 'user'@'localhost' IDENTIFIED BY 'rootpassword';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;

-- Flush privileges to ensure changes take effect
FLUSH PRIVILEGES;