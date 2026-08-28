ALTER TABLE `water_measurements` ADD `approvalStatus` enum('draft','approved') DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE `water_measurements` ADD `submittedByOpenId` varchar(64);--> statement-breakpoint
ALTER TABLE `water_measurements` ADD `approvedByOpenId` varchar(64);--> statement-breakpoint
ALTER TABLE `water_measurements` ADD `approvalNote` text;--> statement-breakpoint
ALTER TABLE `water_measurements` ADD `approvedAt` timestamp;