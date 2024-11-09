/*
  Warnings:

  - Added the required column `locality` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "locality" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL;
