import { House } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { HouseCreateInput } from "@/lib/generated/prisma/models/House";
import { revalidatePath } from "next/cache";

export async function getHouses() {
  try {
    const houses: House[] = await prisma.house.findMany({
      orderBy: { createdAt: "asc" },
    });

    return houses;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function createHouse(prevData: any, request: HouseCreateInput) {
  const validateMessage = validateHouse(request);
  if (validateMessage) {
    return validateMessage;
  }

  try {
    await prisma.house.create({
      data: request,
    });

    revalidatePath("/admin/houses");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function updateHouse(prevData: any, request: HouseCreateInput) {
  if (!request.id) {
    return { error: "Идентификатор отсутствует" };
  }

  const validateMessage = validateHouse(request);
  if (validateMessage) {
    return validateMessage;
  }

  try {
    await prisma.house.update({
      where: { id: request.id },
      data: request,
    });

    revalidatePath("/admin/houses");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function deleteHouse(prevData: any, id: string) {
  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }

  try {
    await prisma.house.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/houses");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

function validateHouse(house: HouseCreateInput) {
  const {
    name,
    type,
    price,
    houseArea,
    plotArea,
    landCategory,
    finishing,
    heating,
    floor,
    bedroom,
    bathroom,
    wallMaterial,
    houseStatus,
    saleStatus,
    latitude,
    longitude,
  } = house;

  if (!name.trim()) {
    return { error: "Название обязательно" };
  }
  if (type === undefined) {
    return { error: "Вид объекта обязателен" };
  }
  if (!String(price).trim()) {
    return { error: "Цена обязательна" };
  }
  if (!String(houseArea).trim()) {
    return { error: "Площадь дома обязательна" };
  }
  if (!String(plotArea).trim()) {
    return { error: "Площадь участка обязательна" };
  }
  if (landCategory === undefined) {
    return { error: "Категория земли обязательна" };
  }
  if (finishing === undefined) {
    return { error: "Отделка обязательна" };
  }
  if (heating === undefined) {
    return { error: "Отопление обязателдьно" };
  }
  if (floor === undefined) {
    return { error: "Количество этажей обязательно" };
  }
  if (bedroom === undefined) {
    return { error: "Количество спален обязательно" };
  }
  if (bathroom === undefined) {
    return { error: "Количество сан. узлов обязательно" };
  }
  if (wallMaterial === undefined) {
    return { error: "Материал стен обязателен" };
  }
  if (houseStatus === undefined) {
    return { error: "Статус дома обязателен" };
  }
  if (saleStatus === undefined) {
    return { error: "Статус продажи обязателен" };
  }

  if (!String(latitude).trim()) {
    return { error: "Широта обязательна" };
  }
  if (!String(longitude).trim()) {
    return { error: "Долгота обязательна" };
  }
}
