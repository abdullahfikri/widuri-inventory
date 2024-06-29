/*
  Warnings:

  - Made the column `stock` on table `Subvariation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `Subvariation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Subvariation" ALTER COLUMN "stock" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL;
