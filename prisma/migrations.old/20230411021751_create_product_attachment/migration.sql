-- CreateTable
CREATE TABLE "product_attachment" (
    "attachment_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "attachment_url" TEXT NOT NULL,
    "attachment_filename" TEXT NOT NULL,
    "attachment_mime_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "product_attachment_pkey" PRIMARY KEY ("attachment_id")
);

-- AddForeignKey
ALTER TABLE "product_attachment" ADD CONSTRAINT "product_attachment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
