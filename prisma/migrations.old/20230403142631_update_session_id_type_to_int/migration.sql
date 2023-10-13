/*
  Warnings:

  - The primary key for the `session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `session_id` column on the `session` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "session" DROP CONSTRAINT "session_pkey",
DROP COLUMN "session_id",
ADD COLUMN     "session_id" SERIAL NOT NULL,
ADD CONSTRAINT "session_pkey" PRIMARY KEY ("session_id");
