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
  
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
);

COMMIT;