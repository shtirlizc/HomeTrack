"use server";

import { MainList } from "@/components/main/list";
import { getHouses } from "@/app/actions/houses";
import { getDistricts } from "@/app/actions/districts";

export default async function HousesPage() {
  const houses = (await getHouses()) ?? [];
  const districts = (await getDistricts()) ?? [];

  return (
    <MainList
      houses={houses.filter(({ isActive }) => isActive)}
      districts={districts}
    />
  );
}
