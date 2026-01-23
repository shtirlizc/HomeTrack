"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IncludedHouse } from "@/app/actions/houses";
import { District } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  houses: IncludedHouse[];
  districts: District[];
}

export const MainList = ({ houses, districts }: Props) => {
  return (
    <div className="flex flex-wrap justify-start py-5 gap-4">
      {houses.map(({ id, name, districtId }) => (
        <Card key={id} className="relative w-full max-w-sm">
          <CardHeader>
            <CardAction>
              <Badge variant="secondary">
                {districts.find((item) => item.id === districtId)?.title}
              </Badge>
            </CardAction>
            <CardTitle>{name}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Link href={`/houses/${id}`} className="w-full">
              <Button className="w-full">Посмотреть</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
