-- Create schema and users for expander
CREATE DATABASE IF NOT EXISTS `expander_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `expander_db`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('client','admin') NOT NULL DEFAULT 'client',
  `companyName` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- sample admin
INSERT INTO `users` (email, password, role, companyName) VALUES
('admin@example.com', 'REPLACE_WITH_HASHED_PASSWORD', 'admin', 'Expanders Inc')
ON DUPLICATE KEY UPDATE email = email;
