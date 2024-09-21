/*
  Warnings:

  - The `gross_amount` column on the `donations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `net_value_amount` column on the `donations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "donations" DROP COLUMN "gross_amount",
ADD COLUMN     "gross_amount" DECIMAL(65,30),
DROP COLUMN "net_value_amount",
ADD COLUMN     "net_value_amount" DECIMAL(65,30);
