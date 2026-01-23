"use server";

import { prisma } from "@/lib/prisma";
import { HousePhone, Prisma } from "@prisma/client";
import HousePhoneUncheckedCreateInput = Prisma.HousePhoneUncheckedCreateInput;

export async function getHousePhones() {
  try {
    const housePhones: HousePhone[] = await prisma.housePhone.findMany({
      orderBy: { createdAt: "asc" },
    });

    return housePhones;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function createHousePhone(
  request: HousePhoneUncheckedCreateInput,
) {
  const { houseId, phoneId } = request;

  if (!houseId) {
    return { error: "Указатель объекта обязателен" };
  }
  if (!phoneId) {
    return { error: "Указатель телефона обязателен" };
  }

  try {
    await prisma.housePhone.create({
      data: request,
    });

    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}
