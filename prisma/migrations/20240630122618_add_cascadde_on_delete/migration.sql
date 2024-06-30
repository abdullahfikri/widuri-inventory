-- DropForeignKey
ALTER TABLE "Subvariation" DROP CONSTRAINT "Subvariation_variation_id_fkey";

-- DropForeignKey
ALTER TABLE "Variation" DROP CONSTRAINT "Variation_item_id_fkey";

-- AddForeignKey
ALTER TABLE "Variation" ADD CONSTRAINT "Variation_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subvariation" ADD CONSTRAINT "Subvariation_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "Variation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
