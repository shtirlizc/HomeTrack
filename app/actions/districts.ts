"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { District } from "@/lib/generated/prisma/client";
import { DistrictCreateInput } from "@/lib/generated/prisma/models/District";

export async function getDistricts() {
  try {
    const districts: District[] = await prisma.district.findMany({
      orderBy: { createdAt: "asc" },
    });

    return districts;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function createDistrict(
  prevData: any,
  request: DistrictCreateInput,
) {
  const { title, description } = request;

  if (!title.trim()) {
    return { error: "Название обязательно" };
  }

  try {
    await prisma.district.create({
      data: {
        title,
        description,
      },
    });

    revalidatePath("/admin/dict/district");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function updateDistrict(
  prevData: any,
  request: DistrictCreateInput,
) {
  const { id, title, description } = request;

  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }
  if (!title.trim()) {
    return { error: "Название обязательно" };
  }

  try {
    await prisma.district.update({
      where: {
        id,
      },
      data: {
        title,
        description,
      },
    });

    revalidatePath("/admin/dict/district");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function deleteDistrict(prevData: any, id: string) {
  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }

  try {
    await prisma.district.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/dict/district");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}
