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
