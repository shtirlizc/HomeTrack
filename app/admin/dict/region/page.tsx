"use server";

import { getRegions } from "@/app/actions/regions";
import { RegionsTable } from "@/components/admin/dict/region/grid-data";

export default async function RegionPage() {
  const regions = await getRegions();
  if (!regions) {
    return null;
  }

  return <RegionsTable regions={regions} />;
}
