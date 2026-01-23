"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Developer, Prisma } from "@prisma/client";
import DeveloperCreateInput = Prisma.DeveloperCreateInput;

export async function getDevelopers() {
  try {
    const developers: Developer[] = await prisma.developer.findMany({
      orderBy: { createdAt: "asc" },
    });

    return developers;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function createDeveloper(
  prevData: any,
  request: DeveloperCreateInput,
) {
  const { title, link } = request;

  if (!title.trim()) {
    return { error: "Название обязательно" };
  }

  try {
    await prisma.developer.create({
      data: {
        title,
        link,
      },
    });

    revalidatePath("/admin/dict/developer");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function updateDeveloper(
  prevData: any,
  request: DeveloperCreateInput,
) {
  const { id, title, phone, link } = request;

  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }
  if (!title.trim()) {
    return { error: "Название обязательно" };
  }

  try {
    await prisma.developer.update({
      where: {
        id,
      },
      data: {
        title,
        phone,
        link,
      },
    });

    revalidatePath("/admin/dict/developer");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function deleteDeveloper(prevData: any, id: string) {
  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }

  try {
    await prisma.developer.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/dict/developer");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}
