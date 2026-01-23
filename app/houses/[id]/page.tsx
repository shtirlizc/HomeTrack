"use server";

import { getHouse } from "@/app/actions/houses";

export default async function HousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const house = await getHouse(id);

  if (!house) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl">{house.name}</h1>
    </div>
  );
}
