"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { District } from "@/lib/generated/prisma/client";

export async function getDistricts() {
  try {
    const districts: District[] = await prisma.district.findMany();

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
