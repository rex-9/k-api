/*
  Warnings:

  - You are about to drop the column `email_id` on the `authentication` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `authentication` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number_id` on the `authentication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "authentication" DROP COLUMN "email_id",
DROP COLUMN "password_hash",
DROP COLUMN "phone_number_id",
ADD COLUMN     "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp_expiration" TIMESTAMP(3);
