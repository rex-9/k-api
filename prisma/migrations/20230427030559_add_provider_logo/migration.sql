/*
  Warnings:

  - Added the required column `provider_logo` to the `providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "providers" ADD COLUMN     "provider_logo" TEXT NOT NULL;
