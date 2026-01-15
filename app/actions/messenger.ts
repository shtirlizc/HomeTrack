"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Messenger } from "@/lib/generated/prisma/client";
import { MessengerCreateInput } from "@/lib/generated/prisma/models/Messenger";

export async function getMessengers() {
  try {
    const messengers: Messenger[] = await prisma.messenger.findMany({
      orderBy: { createdAt: "asc" },
    });

    return messengers;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function createMessenger(
  prevData: any,
  request: MessengerCreateInput,
) {
  const { link, label, isDefault } = request;

  if (!link.trim()) {
    return { error: "Название обязательно" };
  }
  if (!label.trim()) {
    return { error: "Описание обязательно" };
  }

  try {
    await prisma.messenger.create({
      data: {
        link,
        label,
        isDefault,
      },
    });

    revalidatePath("/admin/dict/messenger");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function updateMessenger(
  prevData: any,
  request: MessengerCreateInput,
) {
  const { id, link, label, isDefault } = request;

  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }
  if (!link.trim()) {
    return { error: "Ссылка обязательно" };
  }
  if (!label.trim()) {
    return { error: "Описание обязательно" };
  }

  try {
    await prisma.messenger.update({
      where: {
        id,
      },
      data: {
        link,
        label,
        isDefault,
      },
    });

    revalidatePath("/admin/dict/messenger");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function deleteMessenger(prevData: any, id: string) {
  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }

  try {
    await prisma.messenger.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/dict/messenger");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}
