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
  `time` int,
  `entry_number` int,
  `exit_number` int,
  `safe_amount` int
);

CREATE TABLE IF NOT EXISTS `room_hours` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `entry` datetime,
  `exit` datetime,
  `room` varchar(255),
  `reservation_name` varchar(255),
  `reservation_id` int,
  `given_key` boolean DEFAULT false
)

CREATE TABLE IF NOT EXISTS `room_events` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `type` varchar(255),
  `user_id` int,
  `room_data_id` int,
  `observations` text DEFAULT "",
  `created_at` timestamp DEFAULT (now())
)

CREATE TABLE IF NOT EXISTS `workstations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `capacity` int DEFAULT 0,
  `occupation` int DEFAULT 0,
  `type` ENUM ('active', 'disabled', 'remote')
);

CREATE TABLE IF NOT EXISTS `entries` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `workstation_id` int,
  `ist_id` varchar(12),
  `created_at` timestamp DEFAULT (now()),
  `active` bool DEFAULT true,
  `observations` text
);

CREATE TABLE IF NOT EXISTS `notes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `created_at` timestamp DEFAULT (now()),
  `text` text
);

CREATE TABLE IF NOT EXISTS `publications` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `text` text,
  `created_at` timestamp DEFAULT (now()),
  `active` bool DEFAULT true
);

ALTER TABLE `log_hours` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

ALTER TABLE `room_hours` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

ALTER TABLE `entries` ADD FOREIGN KEY (`workstation_id`) REFERENCES `workstations` (`id`) ON DELETE SET NULL;

ALTER TABLE `notes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

COMMIT;
