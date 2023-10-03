/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Billboard` table. All the data in the column will be lost.
  - You are about to drop the column `public_id` on the `Billboard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Billboard" DROP COLUMN "imageUrl",
DROP COLUMN "public_id";

-- CreateTable
CREATE TABLE "BillboardImage" (
    "id" TEXT NOT NULL,
    "billboardId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillboardImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BillboardImage_billboardId_idx" ON "BillboardImage"("billboardId");

-- AddForeignKey
ALTER TABLE "BillboardImage" ADD CONSTRAINT "BillboardImage_billboardId_fkey" FOREIGN KEY ("billboardId") REFERENCES "Billboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
