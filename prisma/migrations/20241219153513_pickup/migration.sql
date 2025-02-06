-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('TRANSFERENCIA', 'CUOTAS');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isPickup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentDetails" JSONB,
ADD COLUMN     "paymentProof" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'TRANSFERENCIA',
ADD COLUMN     "pickupDni" TEXT,
ADD COLUMN     "pickupName" TEXT;
