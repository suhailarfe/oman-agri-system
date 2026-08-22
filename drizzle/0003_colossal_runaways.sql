CREATE TABLE `mvp_document_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentKey` varchar(96) NOT NULL,
	`versionTag` varchar(32) NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(64) NOT NULL,
	`status` varchar(96) NOT NULL,
	`summary` text NOT NULL,
	`content` text NOT NULL,
	`changeSummary` text NOT NULL,
	`accessLevel` enum('investor','admin') NOT NULL DEFAULT 'investor',
	`createdByOpenId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mvp_document_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roadmap_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`timeframe` varchar(128) NOT NULL,
	`status` enum('complete','active','planned','future') NOT NULL,
	`description` text NOT NULL,
	`progressPercent` int NOT NULL,
	`sortOrder` int NOT NULL,
	`investorVisible` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roadmap_milestones_id` PRIMARY KEY(`id`),
	CONSTRAINT `roadmap_milestones_code_unique` UNIQUE(`code`)
);
