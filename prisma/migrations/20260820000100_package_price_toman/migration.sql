-- Rename Package.price -> Package.priceToman and convert the stored values.
--
-- The old column held *thousands of toman* (990 meant ۹۹۰ هزار تومان). The admin panel
-- now edits this value directly, so the column stores whole toman and says so in its
-- name. Written by hand rather than generated so the existing prices are carried across
-- (× 1000) instead of being dropped along with the column.
ALTER TABLE "Package" RENAME COLUMN "price" TO "priceToman";
UPDATE "Package" SET "priceToman" = "priceToman" * 1000;
