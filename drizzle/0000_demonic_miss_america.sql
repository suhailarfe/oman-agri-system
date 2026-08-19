CREATE TABLE `email_alert_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` text NOT NULL,
	`content` text NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'sent',
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_alert_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_feasibility` (
	`id` int AUTO_INCREMENT NOT NULL,
	`regionCode` varchar(32) NOT NULL,
	`regionName` varchar(128) NOT NULL,
	`capexMillionOMR` varchar(64) NOT NULL,
	`irrPercent` varchar(32) NOT NULL,
	`paybackYears` varchar(32) NOT NULL,
	`annualRevenueOMR` varchar(64) NOT NULL,
	`riskLevel` varchar(32) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_feasibility_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `regions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`name` varchar(128) NOT NULL,
	`governorate` varchar(128) NOT NULL,
	`areaSize` varchar(64) NOT NULL,
	`crops` text NOT NULL,
	`waterSolution` text NOT NULL,
	`description` text NOT NULL,
	`latitude` decimal(10,6),
	`longitude` decimal(10,6),
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `regions_id` PRIMARY KEY(`id`),
	CONSTRAINT `regions_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `seed_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`origin` varchar(128) NOT NULL,
	`description` text NOT NULL,
	`isNonGmo` int NOT NULL DEFAULT 1,
	CONSTRAINT `seed_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `visitor_inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitor_inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `water_solutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(128) NOT NULL,
	`category` varchar(64) NOT NULL,
	`description` text NOT NULL,
	`impact` text NOT NULL,
	CONSTRAINT `water_solutions_id` PRIMARY KEY(`id`)
);
