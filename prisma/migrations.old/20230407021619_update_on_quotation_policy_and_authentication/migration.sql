/*
  Warnings:

  - A unique constraint covering the columns `[policy_no]` on the table `policy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quotation_no]` on the table `quotation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `policy_no` to the `policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quotation_no` to the `quotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authentication" ADD COLUMN     "auth_provider" TEXT,
ADD COLUMN     "auth_provider_id" TEXT,
ADD COLUMN     "auth_provider_payload" JSONB;

-- AlterTable
ALTER TABLE "policy" ADD COLUMN     "policy_no" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quotation" ADD COLUMN     "quotation_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "policy_policy_no_key" ON "policy"("policy_no");

-- CreateIndex
CREATE UNIQUE INDEX "quotation_quotation_no_key" ON "quotation"("quotation_no");
