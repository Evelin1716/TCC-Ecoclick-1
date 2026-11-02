ALTER TABLE "PointLedger"
ADD COLUMN "refKey" TEXT;

CREATE UNIQUE INDEX "PointLedger_refKey_key"
ON "PointLedger"("refKey");
