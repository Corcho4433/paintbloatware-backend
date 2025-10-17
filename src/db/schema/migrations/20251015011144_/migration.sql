-- DropForeignKey
ALTER TABLE "public"."comment_threads" DROP CONSTRAINT "comment_threads_id_comment_fkey";

-- DropForeignKey
ALTER TABLE "public"."comment_threads" DROP CONSTRAINT "comment_threads_id_user_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_id_post_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_id_user_fkey";

-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_id_user_fkey";

-- DropForeignKey
ALTER TABLE "public"."ratings" DROP CONSTRAINT "ratings_id_post_fkey";

-- DropForeignKey
ALTER TABLE "public"."ratings" DROP CONSTRAINT "ratings_id_user_fkey";

-- DropForeignKey
ALTER TABLE "public"."sessions" DROP CONSTRAINT "sessions_id_user_fkey";

-- DropForeignKey
ALTER TABLE "public"."tagsForPost" DROP CONSTRAINT "tagsForPost_id_post_fkey";

-- DropForeignKey
ALTER TABLE "public"."tagsForPost" DROP CONSTRAINT "tagsForPost_id_tag_fkey";

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_threads" ADD CONSTRAINT "comment_threads_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_threads" ADD CONSTRAINT "comment_threads_id_comment_fkey" FOREIGN KEY ("id_comment") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tagsForPost" ADD CONSTRAINT "tagsForPost_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tagsForPost" ADD CONSTRAINT "tagsForPost_id_tag_fkey" FOREIGN KEY ("id_tag") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
