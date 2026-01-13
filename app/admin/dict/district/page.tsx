"use server";

import { getDistricts } from "@/app/actions/districts";
import { DistrictsTable } from "@/components/admin/dict/grid-data";

export default async function DistrictPage() {
  const districts = await getDistricts();
  if (!districts) {
    return null;
  }

  return <DistrictsTable districts={districts} />;
}
