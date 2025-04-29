-- AlterTable
ALTER TABLE "PasswordResetToken" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "settings" SET DEFAULT '{"maxUsers": 1, "maxWorkspaces": 1, "maxStorage": 100}';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastFailedLogin" TIMESTAMP(3),
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3);
