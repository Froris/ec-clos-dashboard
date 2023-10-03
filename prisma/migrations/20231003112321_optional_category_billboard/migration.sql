-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_billboardId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "billboardId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_billboardId_fkey" FOREIGN KEY ("billboardId") REFERENCES "Billboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
