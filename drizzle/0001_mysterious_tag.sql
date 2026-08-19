CREATE TABLE `investor_bookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`regionCode` varchar(32) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `investor_bookmarks_id` PRIMARY KEY(`id`)
);
