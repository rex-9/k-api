-- CreateTable
CREATE TABLE "external_data" (
    "data_id" SERIAL NOT NULL,
    "data_name" TEXT NOT NULL,
    "data_type" TEXT NOT NULL,
    "data_value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "external_data_pkey" PRIMARY KEY ("data_id")
);
