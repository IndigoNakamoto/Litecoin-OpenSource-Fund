-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "gross_amount" TEXT,
ADD COLUMN     "net_value_amount" TEXT,
ADD COLUMN     "net_value_currency" TEXT;
