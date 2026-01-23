"use server";

import MainLayout from "@/components/main/layout";
import { MainList } from "@/components/main/list";
import { getHouses } from "@/app/actions/houses";
import { getDistricts } from "@/app/actions/districts";

export default async function HomePage() {
  const houses = (await getHouses()) ?? [];
  const districts = (await getDistricts()) ?? [];

  return (
    <MainLayout>
      <MainList
        houses={houses.filter(({ isActive }) => isActive)}
        districts={districts}
      />
    </MainLayout>
  );
}
