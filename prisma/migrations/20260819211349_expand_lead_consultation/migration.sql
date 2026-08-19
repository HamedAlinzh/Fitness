-- RedefineTables
-- Adds the consultation quiz answers and contact-preference columns, and relaxes
-- `message` to nullable (the free-text note is optional now that the form is structured).
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Lead" ("id", "name", "phone", "mode", "message", "status", "createdAt")
SELECT "id", "name", "phone", "mode", "message", "status", "createdAt" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
