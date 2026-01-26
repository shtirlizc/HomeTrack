"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Region, Prisma } from "@prisma/client";
import RegionCreateInput = Prisma.RegionCreateInput;

export async function getRegions() {
  try {
    const regions: Region[] = await prisma.region.findMany({
      orderBy: { createdAt: "asc" },
    });

    return regions;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function createRegion(prevData: any, request: RegionCreateInput) {
  const { title, description } = request;

  if (!title.trim()) {
    return { error: "Название обязательно" };
  }

  try {
    await prisma.region.create({
      data: {
        title,
        description,
      },
    });

    revalidatePath("/admin/dict/region");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function updateRegion(prevData: any, request: RegionCreateInput) {
  const { id, title, description } = request;

  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }
  if (!title.trim()) {
    return { error: "Название обязательно" };
  }

  try {
    await prisma.region.update({
      where: {
        id,
      },
      data: {
        title,
        description,
      },
    });

    revalidatePath("/admin/dict/region");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}

export async function deleteRegion(prevData: any, id: string) {
  if (!id) {
    return { error: "Идентификатор отсутствует" };
  }

  try {
    await prisma.region.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/dict/region");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}
