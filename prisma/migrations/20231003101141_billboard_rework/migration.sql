/*
  Warnings:

  - You are about to drop the column `public_id` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `BillboardImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cloudinaryImageId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BillboardImage" DROP CONSTRAINT "BillboardImage_billboardId_fkey";

-- AlterTable
ALTER TABLE "Billboard" ADD COLUMN     "cloudinaryImageId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "public_id",
ADD COLUMN     "cloudinaryImageId" TEXT NOT NULL;

-- DropTable
DROP TABLE "BillboardImage";
