/*
  Warnings:

  - You are about to drop the column `policy_premium` on the `policy` table. All the data in the column will be lost.
  - You are about to drop the column `quotation_price` on the `quotation` table. All the data in the column will be lost.
  - Added the required column `policy_premium_amount` to the `policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quotation_premium_amount` to the `quotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "policy" DROP COLUMN "policy_premium",
ADD COLUMN     "policy_additional_cover_amount" DOUBLE PRECISION,
ADD COLUMN     "policy_comission_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "policy_comission_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "policy_discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "policy_discount_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "policy_premium_amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "policy_vat_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "policy_wht_percent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "quotation" DROP COLUMN "quotation_price",
ADD COLUMN     "quotation_additional_cover_amount" DOUBLE PRECISION,
ADD COLUMN     "quotation_comission_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "quotation_comission_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "quotation_discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "quotation_discount_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "quotation_premium_amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quotation_vat_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "quotation_wht_percent" DOUBLE PRECISION NOT NULL DEFAULT 0;
