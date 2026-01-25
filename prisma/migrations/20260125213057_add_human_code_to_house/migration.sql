/*
  Warnings:

  - A unique constraint covering the columns `[humanCode]` on the table `House` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `humanCode` to the `House` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "House" ADD COLUMN     "humanCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "House_humanCode_key" ON "House"("humanCode");
