"use server";

import { getHouses } from "@/app/actions/houses";
import { HousesTable } from "@/components/admin/houses/grid-data";
import { getDistricts } from "@/app/actions/districts";
import { getDevelopers } from "@/app/actions/developers";

export default async function HousesPage() {
  const houses = await getHouses();
  if (!houses) {
    return null;
  }

  const districts = (await getDistricts()) ?? null;
  const developers = (await getDevelopers()) ?? null;

  const dictionaries = {
    districts,
    developers,
  };

  return (
    <div className="md:pt-6 pt-2">
      <HousesTable houses={houses} dictionaries={dictionaries} />
    </div>
  );
}
