/*
  Warnings:

  - You are about to alter the column `pledgeAmount` on the `donations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,8)`.

*/
-- AlterTable
ALTER TABLE "donations" ALTER COLUMN "pledgeAmount" SET DATA TYPE DECIMAL(10,8);
