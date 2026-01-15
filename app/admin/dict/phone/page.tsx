"use server";

import { getPhones } from "@/app/actions/phone";
import { PhonesTable } from "@/components/admin/dict/phone/grid-data";

export default async function PhonePage() {
  const phones = await getPhones();
  if (!phones) {
    return null;
  }

  return <PhonesTable phones={phones} />;
}
