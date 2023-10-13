-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('INSURER', 'BROKER', 'AGENT', 'CUSTOMER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "providerProvider_id" INTEGER;

-- CreateTable
CREATE TABLE "provider" (
    "provider_id" SERIAL NOT NULL,
    "provider_name" TEXT NOT NULL,
    "provider_address" TEXT NOT NULL,
    "provider_phone" TEXT NOT NULL,
    "provider_email" TEXT NOT NULL,
    "provider_type" "ProviderType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("provider_id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_providerProvider_id_fkey" FOREIGN KEY ("providerProvider_id") REFERENCES "provider"("provider_id") ON DELETE SET NULL ON UPDATE CASCADE;
