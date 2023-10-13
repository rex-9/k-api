/*
  Warnings:

  - You are about to drop the column `providerProvider_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_providerProvider_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "providerProvider_id",
ADD COLUMN     "provider_id" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("provider_id") ON DELETE SET NULL ON UPDATE CASCADE;
