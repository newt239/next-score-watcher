CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`rule_type` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`last_accessed_at` integer,
	`deleted_at` integer,
	`discord_webhook_url` text,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_aql_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`left_team` text NOT NULL,
	`right_team` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_attacksurvival_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`win_point` integer DEFAULT 5 NOT NULL,
	`lose_point` integer DEFAULT 3 NOT NULL,
	`attack_point` integer DEFAULT 3 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_backstream_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`initial_point` integer DEFAULT 10 NOT NULL,
	`win_point` integer DEFAULT 20 NOT NULL,
	`lose_threshold` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_divide_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`win_point` integer DEFAULT 100 NOT NULL,
	`base_point` integer DEFAULT 10 NOT NULL,
	`initial_point` integer DEFAULT 10 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_endless_chance_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`lose_count` integer DEFAULT 3 NOT NULL,
	`use_r` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_freezex_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`win_point` integer DEFAULT 5 NOT NULL,
	`freeze_point` integer DEFAULT 3 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_log` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text,
	`player_id` text,
	`question_number` integer,
	`action_type` text NOT NULL,
	`score_change` integer DEFAULT 0,
	`timestamp` integer,
	`is_system_action` integer DEFAULT false,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_nbyn_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`n_value` integer DEFAULT 5 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_nomr_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`win_point` integer DEFAULT 7 NOT NULL,
	`rest_count` integer DEFAULT 3 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_nomx_ad_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`win_point` integer DEFAULT 7 NOT NULL,
	`lose_point` integer DEFAULT 3 NOT NULL,
	`streak_over3` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_nomx_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`win_point` integer DEFAULT 7 NOT NULL,
	`lose_point` integer DEFAULT 3 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_nupdown_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`win_point` integer DEFAULT 5 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_ny_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`target_point` integer DEFAULT 10 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_player` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text,
	`player_id` text,
	`display_order` integer NOT NULL,
	`initial_score` integer DEFAULT 0,
	`initial_correct_count` integer DEFAULT 0,
	`initial_wrong_count` integer DEFAULT 0,
	`user_id` text,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_squarex_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`square_size` integer DEFAULT 3 NOT NULL,
	`win_condition` integer DEFAULT 3 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_swedish10_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`win_point` integer DEFAULT 10 NOT NULL,
	`lose_point` integer DEFAULT 10 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text,
	`tag_id` text,
	`user_id` text,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_variables_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`win_point` integer DEFAULT 10 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_z_setting` (
	`game_id` text PRIMARY KEY NOT NULL,
	`win_point` integer DEFAULT 5 NOT NULL,
	`zone_point` integer DEFAULT 3 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `player` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`affiliation` text,
	`description` text,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `player_player_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text,
	`player_tag_id` text,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_tag_id`) REFERENCES `player_tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `player_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text,
	`tag_name` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quiz_question` (
	`id` text PRIMARY KEY NOT NULL,
	`quiz_set_id` text,
	`question_number` integer NOT NULL,
	`question_text` text NOT NULL,
	`answer_text` text NOT NULL,
	`category` text,
	`difficulty_level` integer,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`quiz_set_id`) REFERENCES `quiz_set`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quiz_set` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`total_questions` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`email_verified` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `user_preference` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`theme` text DEFAULT 'light' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
