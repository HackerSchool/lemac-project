START TRANSACTION;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `ist_id` varchar(12) UNIQUE NOT NULL,
  `name` varchar(255),
  `active` bool DEFAULT true,
  `admin` bool DEFAULT false
);

CREATE TABLE IF NOT EXISTS `log_hours` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `entry` datetime,
  `exit` datetime,
  `time` int
);

CREATE TABLE IF NOT EXISTS `workstations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `state` bool DEFAULT false,
  `type` ENUM ('active', 'disabled', 'remote')
);

CREATE TABLE IF NOT EXISTS `entries` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `workstation_id` int,
  `ist_id` varchar(12),
  `created_at` timestamp DEFAULT (now()),
  `active` bool DEFAULT true
);

CREATE TABLE IF NOT EXISTS `notes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `created_at` timestamp DEFAULT (now()),
  `text` text
);

ALTER TABLE `log_hours` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `entries` ADD FOREIGN KEY (`workstation_id`) REFERENCES `workstations` (`id`);

ALTER TABLE `notes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

COMMIT;