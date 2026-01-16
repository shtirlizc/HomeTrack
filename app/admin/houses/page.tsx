"use server";

import { getHouses } from "@/app/actions/houses";
import { HousesTable } from "@/components/admin/houses/grid-data";

export default async function HousesPage() {
  const houses = await getHouses();
  if (!houses) {
    return null;
  }

  return (
    <div className="md:pt-6 pt-2">
      <HousesTable
        houses={houses.map((_) => {
          return { ..._, messengers: [], phones: [] };
        })}
      />
    </div>
  );
}
