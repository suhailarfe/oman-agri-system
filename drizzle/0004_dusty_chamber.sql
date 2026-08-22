CREATE TABLE `roadmap_progress_audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`milestoneCode` varchar(64) NOT NULL,
	`previousProgressPercent` int NOT NULL,
	`nextProgressPercent` int NOT NULL,
	`reason` text NOT NULL,
	`changedByOpenId` varchar(64) NOT NULL,
	`changedByName` varchar(255),
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `roadmap_progress_audits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `mvp_document_versions` ADD `publicationState` enum('draft','approved') DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE `mvp_document_versions` ADD `approvedByOpenId` varchar(64);--> statement-breakpoint
ALTER TABLE `mvp_document_versions` ADD `approvedAt` timestamp;--> statement-breakpoint
ALTER TABLE `mvp_document_versions` ADD `approvalNote` text;