-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'LOGGED_OUT');

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE';
