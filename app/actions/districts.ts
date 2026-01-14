"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { District } from "@/lib/generated/prisma/client";

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

export async function addDistrict(prevData: any, formData: FormData) {
  const title = formData.get("title") as "string";
  const description = formData.get("description") as "string";

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

export async function updateDistrict(prevData: any, formData: FormData) {
  const id = formData.get("id") as "string";
  const title = formData.get("title") as "string";
  const description = formData.get("description") as "string";

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

export async function deleteDistrict(prevData: any, districtId: string) {
  if (!districtId) {
    return { error: "Идентификатор отсутствует" };
  }

  try {
    await prisma.district.delete({
      where: {
        id: districtId,
      },
    });

    revalidatePath("/admin/dict/district");
    return { success: true };
  } catch (error: any) {
    return error?.message ?? "Неизвестная ошибка";
  }
}
