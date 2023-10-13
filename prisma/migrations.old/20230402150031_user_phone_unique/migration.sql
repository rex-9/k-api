/*
  Warnings:

  - A unique constraint covering the columns `[user_phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_user_phone_key" ON "users"("user_phone");
