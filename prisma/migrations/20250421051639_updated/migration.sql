/*
  Warnings:

  - You are about to drop the column `usDeleted` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "usDeleted",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
