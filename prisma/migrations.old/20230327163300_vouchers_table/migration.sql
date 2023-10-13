-- CreateTable
CREATE TABLE "voucher" (
    "voucher_id" SERIAL NOT NULL,
    "voucher_code" TEXT NOT NULL,
    "voucher_type" TEXT NOT NULL,
    "voucher_amount" DOUBLE PRECISION NOT NULL,
    "product_id" INTEGER NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "voucher_pkey" PRIMARY KEY ("voucher_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voucher_voucher_code_key" ON "voucher"("voucher_code");

-- AddForeignKey
ALTER TABLE "voucher" ADD CONSTRAINT "voucher_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
