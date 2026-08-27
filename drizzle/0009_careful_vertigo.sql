CREATE TABLE `water_measurements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`regionCode` varchar(32) NOT NULL,
	`sourceName` varchar(160) NOT NULL,
	`sourceType` varchar(96) NOT NULL,
	`ph` decimal(3,1) NOT NULL,
	`salinityPpm` int NOT NULL,
	`flowRate` varchar(96) NOT NULL,
	`operationalStatus` varchar(128) NOT NULL,
	`sampledAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `water_measurements_id` PRIMARY KEY(`id`)
);
