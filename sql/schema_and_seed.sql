-- Drop and recreate database
DROP DATABASE IF EXISTS `coach_app`;
CREATE DATABASE `coach_app` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `coach_app`;

-- Users table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `tokens` INT NOT NULL DEFAULT 0,
  `xp` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Coaches table
CREATE TABLE `coaches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `cost` INT NOT NULL DEFAULT 10,
  `xp_award` INT NOT NULL DEFAULT 5,
  `red_flag` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Unlocks log table
CREATE TABLE `coach_unlocks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `coach_id` INT NOT NULL,
  `tokens_spent` INT NOT NULL,
  `xp_awarded` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`coach_id`) REFERENCES `coaches`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- XP logs table
CREATE TABLE `xp_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `change` INT NOT NULL,
  `reason` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed data for users
INSERT INTO `users` (`name`, `tokens`, `xp`) VALUES
('Alice', 50, 10),
('Bob', 15, 0);

-- Seed data for coaches
INSERT INTO `coaches` (`name`, `description`, `cost`, `xp_award`, `red_flag`) VALUES
('Coach A', 'Focus on time management', 10, 5, 0),
('Coach B', 'Controversial methods', 10, 5, 1),
('Coach C', 'Strength training', 10, 5, 0);

-- Optional: mark Coach A as already unlocked by Alice
INSERT INTO `coach_unlocks` (`user_id`, `coach_id`, `tokens_spent`, `xp_awarded`) VALUES
(1, 1, 10, 5);
