-- CreateEnum
CREATE TYPE "HouseType" AS ENUM ('LandPlot', 'Developer', 'Secondary', 'Commercial');

-- CreateEnum
CREATE TYPE "LandCategory" AS ENUM ('IZHS', 'SNT', 'DNT', 'Agricultural', 'Other');

-- CreateEnum
CREATE TYPE "Finishing" AS ENUM ('CleanFinish', 'PreCleanFinish', 'RoughFinish');

-- CreateEnum
CREATE TYPE "Heating" AS ENUM ('Gas', 'Electricity', 'Other');

-- CreateEnum
CREATE TYPE "FloorCount" AS ENUM ('One', 'Two', 'Three');

-- CreateEnum
CREATE TYPE "BedroomCount" AS ENUM ('One', 'Two', 'Three', 'Four', 'Five');

-- CreateEnum
CREATE TYPE "BathroomCount" AS ENUM ('One', 'Two', 'More');

-- CreateEnum
CREATE TYPE "FacingMaterial" AS ENUM ('BarkBeetlePlaster', 'Brick', 'Siding', 'Other');

-- CreateEnum
CREATE TYPE "WallMaterial" AS ENUM ('Wood', 'Brick', 'ExpandedClay', 'AeratedConcrete', 'Other');

-- CreateEnum
CREATE TYPE "Insulation" AS ENUM ('FoamPlastic', 'MineralWool', 'Other');

-- CreateEnum
CREATE TYPE "HouseStatus" AS ENUM ('BuiltHouse', 'UnderConstruction', 'LandPlot');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('Available', 'Reserved', 'Sold');

-- CreateTable
CREATE TABLE "HouseMessenger" (
    "id" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "messengerId" TEXT NOT NULL,

    CONSTRAINT "HouseMessenger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HousePhone" (
    "id" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "phoneId" TEXT NOT NULL,

    CONSTRAINT "HousePhone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "House" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "HouseType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "houseArea" DOUBLE PRECISION NOT NULL,
    "plotArea" DOUBLE PRECISION NOT NULL,
    "landCategory" "LandCategory" NOT NULL,
    "finishing" "Finishing" NOT NULL,
    "heating" "Heating" NOT NULL,
    "asphaltToHouse" BOOLEAN NOT NULL,
    "closedComplex" BOOLEAN NOT NULL,
    "floor" "FloorCount" NOT NULL,
    "bedroom" "BedroomCount" NOT NULL,
    "separatedKitchenLiving" BOOLEAN NOT NULL,
    "bathroom" "BathroomCount" NOT NULL,
    "facingMaterial" "FacingMaterial",
    "wallMaterial" "WallMaterial" NOT NULL,
    "insulation" "Insulation",
    "hasMinimumDownPayment" BOOLEAN NOT NULL,
    "houseStatus" "HouseStatus" NOT NULL,
    "saleStatus" "SaleStatus" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "cadastralNumber" TEXT,
    "yandexDiskLink" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "districtId" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,

    CONSTRAINT "House_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HouseMessenger_houseId_messengerId_key" ON "HouseMessenger"("houseId", "messengerId");

-- CreateIndex
CREATE UNIQUE INDEX "HousePhone_houseId_phoneId_key" ON "HousePhone"("houseId", "phoneId");

-- AddForeignKey
ALTER TABLE "HouseMessenger" ADD CONSTRAINT "HouseMessenger_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseMessenger" ADD CONSTRAINT "HouseMessenger_messengerId_fkey" FOREIGN KEY ("messengerId") REFERENCES "Messenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HousePhone" ADD CONSTRAINT "HousePhone_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HousePhone" ADD CONSTRAINT "HousePhone_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "Phone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
