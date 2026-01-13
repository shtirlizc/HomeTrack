"use server";

import { DataTable } from "@/components/admin/dict/grid-data";
import { getDistricts } from "@/app/actions/districts";

export default async function DictPage() {
  const districts = await getDistricts();

  console.log("#########", districts);

  return <DataTable />;
}
