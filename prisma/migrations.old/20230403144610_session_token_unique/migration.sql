/*
  Warnings:

  - A unique constraint covering the columns `[session_token]` on the table `session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "session_session_token_key" ON "session"("session_token");
