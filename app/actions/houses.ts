"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { InputJsonValue } from "@prisma/client/runtime/edge";
import { Prisma } from "@prisma/client";
import HouseUncheckedCreateInput = Prisma.HouseUncheckedCreateInput;

export type IncludedHouse = Prisma.HouseGetPayload<{
  include: {
    phones: {
      include: {
        phone: true;
      };
    };
    messengers: {
      include: {
        messenger: true;
      };
    };
  };
}>;

export async function getHouses(): Promise<IncludedHouse[] | null> {
  try {
    return prisma.house.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        phones: {
          include: {
            phone: true,
          },
        },
        messengers: {
          include: {
            messenger: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function getHouse(id: string): Promise<IncludedHouse | null> {
  try {
    return prisma.house.findUnique({
      where: {
        id,
      },
      include: {
        phones: {
          include: {
            phone: true,
          },
        },
        messengers: {
          include: {
            messenger: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function createHouse(prevData: any, request: IncludedHouse) {
  const data: HouseUncheckedCreateInput = {
    ...request,
    id: undefined,
    description: request.description as InputJsonValue,
    phones: undefined,
    messengers: undefined,
  };
  const phoneIds = request.phones.map(({ phone }) => phone.id);
  const messengerIds = request.messengers.map(({ messenger }) => messenger.id);

  const validateMessage = validateHouse(data);
  if (validateMessage) {
    return validateMessage;
  }

  try {
    await prisma.$transaction(async (tx) => {
      const counter = await tx.counter.update({
        where: { name: "house" },
        data: { value: { increment: 1 } },
      });

      await tx.house.create({
        data: {
          ...data,
          humanCode: counter.value.toString(),
          phones: {
            create: phoneIds.map((phoneId) => ({
              phone: { connect: { id: phoneId } },
            })),
          },
          messengers: {
            create: messengerIds.map((messengerId) => ({
              messenger: { connect: { id: messengerId } },
            })),
          },
        },
      });
    });

    revalidatePath("/admin/houses");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function updateHouse(prevData: any, request: IncludedHouse) {
  if (!request.id) {
    return { error: "Идентификатор отсутствует" };
  }

  const data: HouseUncheckedCreateInput = {
    ...request,
    id: undefined,
    description: request.description as InputJsonValue,
    phones: undefined,
    messengers: undefined,
  };
  const phoneIds = request.phones.map(({ phone }) => phone.id);
  const messengerIds = request.messengers.map(({ messenger }) => messenger.id);

  const validateMessage = validateHouse(data);
  if (validateMessage) {
    return validateMessage;
  }

  try {
    await prisma.$transaction(async (tx: any) => {
      await tx.house.update({
        where: { id: request.id },
        data: {
          ...data,
          phones: {
            deleteMany: {},
          },
          messengers: {
            deleteMany: {},
          },
        },
      });

      if (phoneIds.length > 0) {
        await tx.housePhone.createMany({
          data: phoneIds.map((phoneId) => ({
            houseId: request.id,
            phoneId,
          })),
          skipDuplicates: true,
        });
      }
      if (messengerIds.length > 0) {
        await tx.houseMessenger.createMany({
          data: messengerIds.map((messengerId) => ({
            houseId: request.id,
            messengerId,
          })),
          skipDuplicates: true,
        });
      }
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

function validateHouse(house: HouseUncheckedCreateInput) {
  const {
    name,
    districtId,
    developerId,
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
    return { error: "Название обязательно", fieldName: "name" };
  }
  if (!districtId) {
    return { error: "Район обязателен", fieldName: "districtId" };
  }
  if (!developerId) {
    return { error: "Застройщик обязателен", fieldName: "developerId" };
  }
  if (type === undefined) {
    return { error: "Вид объекта обязателен", fieldName: "type" };
  }
  if (!String(price).trim()) {
    return { error: "Цена обязательна", fieldName: "price" };
  }
  if (!String(houseArea).trim()) {
    return { error: "Площадь дома обязательна", fieldName: "houseArea" };
  }
  if (!String(plotArea).trim()) {
    return { error: "Площадь участка обязательна", fieldName: "plotArea" };
  }
  if (landCategory === undefined) {
    return { error: "Категория земли обязательна", fieldName: "landCategory" };
  }
  if (finishing === undefined) {
    return { error: "Отделка обязательна", fieldName: "finishing" };
  }
  if (heating === undefined) {
    return { error: "Отопление обязателдьно", fieldName: "heating" };
  }
  if (floor === undefined) {
    return { error: "Количество этажей обязательно", fieldName: "floor" };
  }
  if (bedroom === undefined) {
    return { error: "Количество спален обязательно", fieldName: "bedroom" };
  }
  if (bathroom === undefined) {
    return {
      error: "Количество сан. узлов обязательно",
      fieldName: "bathroom",
    };
  }
  if (wallMaterial === undefined) {
    return { error: "Материал стен обязателен", fieldName: "wallMaterial" };
  }
  if (houseStatus === undefined) {
    return { error: "Статус дома обязателен", fieldName: "houseStatus" };
  }
  if (saleStatus === undefined) {
    return { error: "Статус продажи обязателен", fieldName: "saleStatus" };
  }
  if (!String(latitude).trim()) {
    return { error: "Широта обязательна", fieldName: "latitude" };
  }
  if (!String(longitude).trim()) {
    return { error: "Долгота обязательна", fieldName: "longitude" };
  }

  return null;
}
