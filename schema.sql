CREATE TABLE `htb_cloud_records` (
	`owner` text NOT NULL,
	`task_id` text NOT NULL,
	`version` integer NOT NULL,
	`object_key` text NOT NULL,
	`hash` text NOT NULL,
	`summary` text NOT NULL,
	`updated` text NOT NULL,
	PRIMARY KEY(`owner`, `task_id`)
);
--> statement-breakpoint
CREATE TABLE `htb_cloud_versions` (
	`owner` text NOT NULL,
	`task_id` text NOT NULL,
	`version` integer NOT NULL,
	`object_key` text NOT NULL,
	`hash` text NOT NULL,
	`summary` text NOT NULL,
	`created` text NOT NULL,
	PRIMARY KEY(`owner`, `task_id`, `version`)
);
