/*
  Warnings:

  - You are about to drop the column `email_confirmed` on the `authentication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "authentication" DROP COLUMN "email_confirmed";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_confirmed" BOOLEAN NOT NULL DEFAULT false;
