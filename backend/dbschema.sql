CREATE TABLE `users` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `ist_id` varchar(12) UNIQUE NOT NULL,
  `name` varchar(255),
  `active` bool DEFAULT true,
  `admin` bool DEFAULT false
);

CREATE TABLE `log_hours` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `entry` datetime,
  `exit` datetime,
  `time` int
);

CREATE TABLE `workstations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `capacity` int DEFAULT 0,
  `occupation` int DEFAULT 0,
  `type` ENUM ('active', 'disabled', 'remote')
);

CREATE TABLE `entries` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `workstation_id` int,
  `ist_id` varchar(12),
  `created_at` timestamp DEFAULT (now()),
  `active` bool DEFAULT true,
  `observations` text
);

CREATE TABLE `notes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `created_at` timestamp DEFAULT (now()),
  `text` text
);

CREATE TABLE `publications` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `text` text,
  `created_at` timestamp DEFAULT (now()),
  `active` bool DEFAULT true
);

CREATE TABLE `cards` (
  `card_id` int UNIQUE,
  `ist_id` varchar(12) UNIQUE
);

ALTER TABLE `log_hours` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

ALTER TABLE `entries` ADD FOREIGN KEY (`workstation_id`) REFERENCES `workstations` (`id`) ON DELETE SET NULL;

ALTER TABLE `notes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;
