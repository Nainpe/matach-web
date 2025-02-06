/*
  Warnings:

  - You are about to drop the column `country` on the `OrderAddress` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `OrderAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderAddress" DROP COLUMN "country",
DROP COLUMN "phoneNumber";
