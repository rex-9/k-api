/*
  Warnings:

  - You are about to drop the column `product_price` on the `product` table. All the data in the column will be lost.
  - Added the required column `provider_id` to the `policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_max_price` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_min_price` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_id` to the `quotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "policy" ADD COLUMN     "provider_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "product_price",
ADD COLUMN     "product_max_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "product_min_price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "quotation" ADD COLUMN     "provider_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "voucher" ADD COLUMN     "payment_id" INTEGER,
ADD COLUMN     "shopping_cart_id" INTEGER;

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy" ADD CONSTRAINT "policy_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher" ADD CONSTRAINT "voucher_shopping_cart_id_fkey" FOREIGN KEY ("shopping_cart_id") REFERENCES "shopping_cart"("cart_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher" ADD CONSTRAINT "voucher_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("payment_id") ON DELETE SET NULL ON UPDATE CASCADE;
