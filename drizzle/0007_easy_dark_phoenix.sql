CREATE TABLE `notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`draftNotificationsEnabled` int NOT NULL DEFAULT 1,
	`publishedNotificationsEnabled` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_preferences_userOpenId_unique` UNIQUE(`userOpenId`)
);
--> statement-breakpoint
CREATE TABLE `saved_audit_filters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`name` varchar(96) NOT NULL,
	`query` varchar(160),
	`fromDate` varchar(10),
	`toDate` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_audit_filters_id` PRIMARY KEY(`id`)
);
