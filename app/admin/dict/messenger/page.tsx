"use server";

import { getMessengers } from "@/app/actions/messenger";
import { MessengersTable } from "@/components/admin/dict/messenger/grid-data";

export default async function MessengerPage() {
  const messengers = await getMessengers();
  if (!messengers) {
    return null;
  }

  return <MessengersTable messengers={messengers} />;
}
