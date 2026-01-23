"use server";

import { getHouses } from "@/app/actions/houses";
import { HousesTable } from "@/components/admin/houses/grid-data";
import { getDistricts } from "@/app/actions/districts";
import { getDevelopers } from "@/app/actions/developers";
import { getPhones } from "@/app/actions/phone";
import { getMessengers } from "@/app/actions/messenger";

export default async function HousesPage() {
  const houses = await getHouses();
  if (!houses) {
    return null;
  }

  const districts = (await getDistricts()) ?? [];
  const developers = (await getDevelopers()) ?? [];
  const phones = (await getPhones()) ?? [];
  const messengers = (await getMessengers()) ?? [];

  const dictionaries = {
    districts,
    developers,
  };

  return (
    <div className="md:pt-6 pt-2">
      <HousesTable
        houses={houses}
        dictionaries={dictionaries}
        phones={phones}
        messengers={messengers}
      />
    </div>
  );
}
