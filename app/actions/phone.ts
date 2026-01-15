"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Phone } from "@/lib/generated/prisma/client";
import { PhoneCreateInput } from "@/lib/generated/prisma/models/Phone";

export async function getPhones() {
  try {
    const phones: Phone[] = await prisma.phone.findMany({
      orderBy: { createdAt: "asc" },
    });

    return phones;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function createPhone(prevData: any, request: PhoneCreateInput) {
  const { phone, label, isDefault } = request;

  if (!phone.trim()) {
    return { error: "Номер обязателен" };
  }
  if (!label.trim()) {
    return { error: "Описание обязательно" };
  }

  try {
    await prisma.phone.create({
      data: {
        phone,
        label,
        isDefault,
      },
    });

    revalidatePath("/admin/dict/phone");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function updatePhone(prevData: any, request: PhoneCreateInput) {
  const { id, phone, label, isDefault } = request;

  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }
  if (!phone.trim()) {
    return { error: "Номер обязателен" };
  }
  if (!label.trim()) {
    return { error: "Описание обязательно" };
  }

  try {
    await prisma.phone.update({
      where: {
        id,
      },
      data: {
        phone,
        label,
        isDefault,
      },
    });

    revalidatePath("/admin/dict/phone");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function deletePhone(prevData: any, id: string) {
  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }

  try {
    await prisma.phone.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/dict/phone");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}
