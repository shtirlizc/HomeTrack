"use server";

import { getDevelopers } from "@/app/actions/developers";
import { DevelopersTable } from "@/components/admin/dict/developer/grid-data";

export default async function DeveloperPage() {
  const developers = await getDevelopers();
  if (!developers) {
    return null;
  }

  return <DevelopersTable developers={developers} />;
}
