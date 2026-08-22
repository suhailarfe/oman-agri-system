ALTER TABLE `notification_preferences` ADD `mutedUntil` timestamp;--> statement-breakpoint
ALTER TABLE `saved_audit_filters` ADD `sortOrder` int DEFAULT 0 NOT NULL;