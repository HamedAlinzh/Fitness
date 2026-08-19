-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InstagramPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortcode" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'REEL',
    "thumbnail" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_InstagramPost" ("createdAt", "id", "shortcode", "sortOrder", "thumbnail", "type") SELECT "createdAt", "id", "shortcode", "sortOrder", "thumbnail", "type" FROM "InstagramPost";
DROP TABLE "InstagramPost";
ALTER TABLE "new_InstagramPost" RENAME TO "InstagramPost";
CREATE UNIQUE INDEX "InstagramPost_shortcode_key" ON "InstagramPost"("shortcode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
