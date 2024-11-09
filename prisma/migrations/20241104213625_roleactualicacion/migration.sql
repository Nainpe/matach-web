/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'User');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User',
ALTER COLUMN "email" SET NOT NULL;
