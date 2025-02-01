-- CreateEnum
CREATE TYPE "PriorityOrder" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "priority" "PriorityOrder" NOT NULL DEFAULT 'LOW';
