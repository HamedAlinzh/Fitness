-- AlterTable
ALTER TABLE "GalleryItem" ADD COLUMN "fileHash" TEXT;

-- CreateIndex
CREATE INDEX "GalleryItem_fileHash_idx" ON "GalleryItem"("fileHash");
