CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `user_preference` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`theme` text DEFAULT 'light' NOT NULL,
	`show_winthrough_popup` integer DEFAULT true NOT NULL,
	`show_board_header` integer DEFAULT true NOT NULL,
	`show_qn` integer DEFAULT false NOT NULL,
	`show_sign_string` integer DEFAULT true NOT NULL,
	`reverse_player_info` integer DEFAULT false NOT NULL,
	`wrong_number` integer DEFAULT true NOT NULL,
	`webhook_url` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `game` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`rule_type` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	`discord_webhook_url` text,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game_log` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text,
	`player_id` text,
	`question_number` integer,
	`action_type` text NOT NULL,
	`score_change` integer DEFAULT 0,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	`is_system_action` integer DEFAULT false,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
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
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text,
	`tag_id` text,
	`user_id` text,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `player` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`affiliation` text,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `player_player_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text,
	`player_tag_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_tag_id`) REFERENCES `player_tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `player_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text,
	`tag_name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
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
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`quiz_set_id`) REFERENCES `quiz_set`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quiz_set` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`total_questions` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game_aql_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`left_team` text NOT NULL,
	`right_team` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_aql_setting_game_id_unique` ON `game_aql_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_attacksurvival_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`win_point` integer DEFAULT 5 NOT NULL,
	`lose_point` integer DEFAULT 3 NOT NULL,
	`attack_point` integer DEFAULT 3 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_attacksurvival_setting_game_id_unique` ON `game_attacksurvival_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_backstream_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`initial_point` integer DEFAULT 10 NOT NULL,
	`win_point` integer DEFAULT 20 NOT NULL,
	`lose_threshold` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_backstream_setting_game_id_unique` ON `game_backstream_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_divide_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`win_point` integer DEFAULT 100 NOT NULL,
	`base_point` integer DEFAULT 10 NOT NULL,
	`initial_point` integer DEFAULT 10 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_divide_setting_game_id_unique` ON `game_divide_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_endless_chance_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`lose_count` integer DEFAULT 3 NOT NULL,
	`use_r` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_endless_chance_setting_game_id_unique` ON `game_endless_chance_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_freezex_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`win_point` integer DEFAULT 5 NOT NULL,
	`freeze_point` integer DEFAULT 3 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_freezex_setting_game_id_unique` ON `game_freezex_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_nbyn_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`n_value` integer DEFAULT 5 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_nbyn_setting_game_id_unique` ON `game_nbyn_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_nomr_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`win_point` integer DEFAULT 7 NOT NULL,
	`rest_count` integer DEFAULT 3 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_nomr_setting_game_id_unique` ON `game_nomr_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_nomx_ad_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`win_point` integer DEFAULT 7 NOT NULL,
	`lose_point` integer DEFAULT 3 NOT NULL,
	`streak_over3` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_nomx_ad_setting_game_id_unique` ON `game_nomx_ad_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_nomx_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`win_point` integer DEFAULT 7 NOT NULL,
	`lose_point` integer DEFAULT 3 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_nomx_setting_game_id_unique` ON `game_nomx_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_nupdown_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`win_point` integer DEFAULT 5 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_nupdown_setting_game_id_unique` ON `game_nupdown_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_ny_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`target_point` integer DEFAULT 10 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_ny_setting_game_id_unique` ON `game_ny_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_squarex_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`square_size` integer DEFAULT 3 NOT NULL,
	`win_condition` integer DEFAULT 3 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_squarex_setting_game_id_unique` ON `game_squarex_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_swedish10_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`win_point` integer DEFAULT 10 NOT NULL,
	`lose_point` integer DEFAULT 10 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_swedish10_setting_game_id_unique` ON `game_swedish10_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_variables_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`win_point` integer DEFAULT 10 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_variables_setting_game_id_unique` ON `game_variables_setting` (`game_id`);--> statement-breakpoint
CREATE TABLE `game_z_setting` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`win_point` integer DEFAULT 5 NOT NULL,
	`zone_point` integer DEFAULT 3 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_z_setting_game_id_unique` ON `game_z_setting` (`game_id`);