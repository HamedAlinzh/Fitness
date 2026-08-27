-- CreateTable
CREATE TABLE "AboutContent" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'about',
    "eyebrow" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "previewText" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "image" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "visitorHash" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "PageView_day_visitorHash_idx" ON "PageView"("day", "visitorHash");

-- CreateIndex
CREATE INDEX "PageView_month_visitorHash_idx" ON "PageView"("month", "visitorHash");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");
