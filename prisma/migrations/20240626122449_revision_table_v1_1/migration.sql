/*
  Warnings:

  - You are about to drop the column `subvariant` on the `Variation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "subvariant" VARCHAR(50);

-- AlterTable
ALTER TABLE "Variation" DROP COLUMN "subvariant";
