export enum HouseType {
  LandPlot = "LandPlot",
  Developer = "Developer",
  Secondary = "Secondary",
  Commercial = "Commercial",
}
const typeMapper: Record<HouseType, string> = {
  [HouseType.LandPlot]: "Земельный участок",
  [HouseType.Developer]: "Дом от застройщика",
  [HouseType.Secondary]: "Дом вторичка",
  [HouseType.Commercial]: "Коммерция",
};

export enum LandCategory {
  IZHS = "IZHS",
  SNT = "SNT",
  DNT = "DNT",
  Agricultural = "Agricultural",
  Other = "Other",
}
const landCategoryMapper: Record<LandCategory, string> = {
  [LandCategory.IZHS]: "ИЖС",
  [LandCategory.SNT]: "СНТ",
  [LandCategory.DNT]: "ДНТ",
  [LandCategory.Agricultural]: "СельХоз",
  [LandCategory.Other]: "Иное",
};

export enum Finishing {
  CleanFinish = "CleanFinish",
  PreCleanFinish = "PreCleanFinish",
  RoughFinish = "RoughFinish",
}
const finishingMapper: Record<Finishing, string> = {
  [Finishing.CleanFinish]: "Чистовая",
  [Finishing.PreCleanFinish]: "Предчистовая",
  [Finishing.RoughFinish]: "Черновая",
};

export enum Heating {
  Gas = "Gas",
  Electricity = "Electricity",
  Other = "Other",
}
const heatingMapper: Record<Heating, string> = {
  [Heating.Gas]: "Газ",
  [Heating.Electricity]: "Электричество",
  [Heating.Other]: "Иное",
};

export enum FloorCount {
  One = "One",
  Two = "Two",
  Three = "Three",
}
const floorCountMapper: Record<FloorCount, string> = {
  [FloorCount.One]: "1",
  [FloorCount.Two]: "2",
  [FloorCount.Three]: "3",
};

export enum BedroomCount {
  One = "One",
  Two = "Two",
  Three = "Three",
  Four = "Four",
  Five = "Five",
}
const bedroomCountMapper: Record<BedroomCount, string> = {
  [BedroomCount.One]: "1",
  [BedroomCount.Two]: "2",
  [BedroomCount.Three]: "3",
  [BedroomCount.Four]: "4",
  [BedroomCount.Five]: "5",
};

export enum BathroomCount {
  One = "One",
  Two = "Two",
  More = "More",
}
const bathroomCountMapper: Record<BathroomCount, string> = {
  [BathroomCount.One]: "1",
  [BathroomCount.Two]: "2",
  [BathroomCount.More]: "2 и более",
};

export enum FacingMaterial {
  BarkBeetlePlaster = "BarkBeetlePlaster",
  Brick = "Brick",
  Siding = "Siding",
  Other = "Other",
}
const facingMaterialMapper: Record<FacingMaterial, string> = {
  [FacingMaterial.BarkBeetlePlaster]: "Короед",
  [FacingMaterial.Brick]: "Кирпич",
  [FacingMaterial.Siding]: "Сайдинг",
  [FacingMaterial.Other]: "Иное",
};

export enum WallMaterial {
  Wood = "Wood",
  Brick = "Brick",
  ExpandedClay = "ExpandedClay",
  AeratedConcrete = "AeratedConcrete",
  Other = "Other",
}
const wallMaterialMapper: Record<WallMaterial, string> = {
  [WallMaterial.Wood]: "Дерево",
  [WallMaterial.Brick]: "Кирпич",
  [WallMaterial.ExpandedClay]: "Керамзит",
  [WallMaterial.AeratedConcrete]: "Газоблок",
  [WallMaterial.Other]: "Иное",
};

export enum Insulation {
  FoamPlastic = "FoamPlastic",
  MineralWool = "MineralWool",
  Other = "Other",
}
const insulationMapper: Record<Insulation, string> = {
  [Insulation.FoamPlastic]: "Пенопласт",
  [Insulation.MineralWool]: "МинВата",
  [Insulation.Other]: "Иное",
};

export enum HouseStatus {
  BuiltHouse = "BuiltHouse",
  UnderConstruction = "UnderConstruction",
  LandPlot = "LandPlot",
}
const statusMapper: Record<HouseStatus, string> = {
  [HouseStatus.BuiltHouse]: "Дом построенный",
  [HouseStatus.UnderConstruction]: "Дом строится",
  [HouseStatus.LandPlot]: "Земельный участок",
};

export enum SaleStatus {
  Available = "Available",
  Reserved = "Reserved",
  Sold = "Sold",
}
const saleMapper: Record<SaleStatus, string> = {
  [SaleStatus.Available]: "Свободный",
  [SaleStatus.Reserved]: "Бронь",
  [SaleStatus.Sold]: "Продан",
};

export const mappers = {
  typeMapper,
  landCategoryMapper,
  finishingMapper,
  heatingMapper,
  floorCountMapper,
  bedroomCountMapper,
  bathroomCountMapper,
  facingMaterialMapper,
  wallMaterialMapper,
  insulationMapper,
  statusMapper,
  saleMapper,
};
