CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_user" uuid NOT NULL,
	"session_token" text NOT NULL,
	CONSTRAINT "sessions_id_user_unique" UNIQUE("id_user"),
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE INDEX "user_session_unique" ON "sessions" USING btree ("id_user","session_token");