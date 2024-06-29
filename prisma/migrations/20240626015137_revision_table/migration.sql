/*
  Warnings:

  - You are about to drop the column `value` on the `Variation` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Variation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to drop the `Stock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_variation_id_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "price" DECIMAL(12,2),
ADD COLUMN     "stock" INTEGER,
ADD COLUMN     "variant" VARCHAR;

-- AlterTable
ALTER TABLE "Variation" DROP COLUMN "value",
ADD COLUMN     "price" DECIMAL(12,2),
ADD COLUMN     "stock" INTEGER,
ADD COLUMN     "subvariant" VARCHAR(50),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- DropTable
DROP TABLE "Stock";

-- CreateTable
CREATE TABLE "Subvariation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "stock" INTEGER,
    "price" DECIMAL(12,2),
    "variation_id" INTEGER NOT NULL,

    CONSTRAINT "Subvariation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subvariation" ADD CONSTRAINT "Subvariation_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "Variation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
