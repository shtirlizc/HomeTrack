-- AlterTable
ALTER TABLE "House" ADD COLUMN     "plan" TEXT[] DEFAULT ARRAY[]::TEXT[];
