"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
  }[];
}) {
  const pathname = usePathname();

  const currentPageName = pathname.split("/");
  currentPageName.length = 3;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map(({ title, url }) => (
            <Link href={url} key={url} className="cursor-pointer">
              <SidebarMenuItem
                className={`p-1 ${currentPageName.join("/") === url && "text-primary"}`}
              >
                <span>{title}</span>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
