-- CreateTable
CREATE TABLE "insured_object" (
    "object_id" SERIAL NOT NULL,
    "object_name" TEXT NOT NULL,
    "object_value" DOUBLE PRECISION NOT NULL,
    "object_desc" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "policy_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "insured_object_pkey" PRIMARY KEY ("object_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" SERIAL NOT NULL,
    "payment_amount" DOUBLE PRECISION NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_gateway_name" TEXT NOT NULL,
    "payment_gateway_ref" TEXT NOT NULL,
    "policy_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "shopping_cart" (
    "cart_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "object_id" INTEGER NOT NULL,
    "quotation_id" INTEGER,
    "cart_quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("cart_id")
);

-- AddForeignKey
ALTER TABLE "insured_object" ADD CONSTRAINT "insured_object_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insured_object" ADD CONSTRAINT "insured_object_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policy"("policy_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policy"("policy_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("quotation_id") ON DELETE SET NULL ON UPDATE CASCADE;
