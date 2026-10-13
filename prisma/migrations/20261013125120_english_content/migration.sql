-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AboutContent" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'about',
    "eyebrow" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "previewText" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "image" TEXT,
    "eyebrowEn" TEXT NOT NULL DEFAULT '',
    "headingEn" TEXT NOT NULL DEFAULT '',
    "previewTextEn" TEXT NOT NULL DEFAULT '',
    "bodyTextEn" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AboutContent" ("bodyText", "eyebrow", "heading", "id", "image", "previewText", "updatedAt") SELECT "bodyText", "eyebrow", "heading", "id", "image", "previewText", "updatedAt" FROM "AboutContent";
DROP TABLE "AboutContent";
ALTER TABLE "new_AboutContent" RENAME TO "AboutContent";
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "telegramUsername" TEXT,
    "preferredChannel" TEXT NOT NULL DEFAULT 'whatsapp',
    "goal" TEXT NOT NULL DEFAULT 'GENERAL_FITNESS',
    "level" TEXT NOT NULL DEFAULT 'BEGINNER',
    "mode" TEXT NOT NULL DEFAULT 'online',
    "daysPerWeek" INTEGER NOT NULL DEFAULT 3,
    "hasInjury" BOOLEAN NOT NULL DEFAULT false,
    "injuryNote" TEXT,
    "message" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'fa',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Lead" ("createdAt", "daysPerWeek", "goal", "hasInjury", "id", "injuryNote", "level", "message", "mode", "name", "phone", "preferredChannel", "status", "telegramUsername") SELECT "createdAt", "daysPerWeek", "goal", "hasInjury", "id", "injuryNote", "level", "message", "mode", "name", "phone", "preferredChannel", "status", "telegramUsername" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE TABLE "new_Package" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceToman" INTEGER NOT NULL,
    "periodLabel" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "periodLabelEn" TEXT NOT NULL DEFAULT '',
    "featuresEn" TEXT NOT NULL DEFAULT '[]',
    "type" TEXT NOT NULL DEFAULT 'ONLINE',
    "highlighted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Package" ("createdAt", "description", "features", "highlighted", "id", "periodLabel", "priceToman", "title", "type") SELECT "createdAt", "description", "features", "highlighted", "id", "periodLabel", "priceToman", "title", "type" FROM "Package";
DROP TABLE "Package";
ALTER TABLE "new_Package" RENAME TO "Package";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
