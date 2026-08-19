-- CreateTable
CREATE TABLE "InstagramPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortcode" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'REEL',
    "caption" TEXT NOT NULL,
    "thumbnail" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "InstagramPost_shortcode_key" ON "InstagramPost"("shortcode");
