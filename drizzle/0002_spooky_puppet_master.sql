CREATE TABLE "comments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"id_user" integer NOT NULL,
	"id_post" integer NOT NULL,
	"content" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "comment" TO "content";--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_id_post_posts_id_fk" FOREIGN KEY ("id_post") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;