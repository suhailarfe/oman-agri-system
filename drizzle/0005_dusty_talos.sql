CREATE TABLE `app_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientRole` enum('admin','user') NOT NULL,
	`type` enum('draft','published','system') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`documentKey` varchar(96),
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `app_notifications_id` PRIMARY KEY(`id`)
);
