ALTER TABLE `user_preference` ADD `show_winthrough_popup` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `user_preference` ADD `show_board_header` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `user_preference` ADD `show_qn` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user_preference` ADD `show_sign_string` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `user_preference` ADD `reverse_player_info` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user_preference` ADD `wrong_number` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `user_preference` ADD `webhook_url` text;--> statement-breakpoint
ALTER TABLE `user_preference` ADD `created_at` integer;--> statement-breakpoint
ALTER TABLE `user_preference` ADD `updated_at` integer;