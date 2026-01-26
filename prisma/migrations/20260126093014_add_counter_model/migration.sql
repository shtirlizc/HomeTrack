-- CreateTable
CREATE TABLE "Counter" (
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("name")
);

INSERT INTO "Counter" ("name", "value")
VALUES ('house', 0)
    ON CONFLICT ("name") DO NOTHING;