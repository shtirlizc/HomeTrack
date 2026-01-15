"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/dark-mode/mode-toggle";
import { ProfileDropdown } from "@/components/admin/dropdown-profile";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface Props {
  userEmail: string;
}

export const SiteHeader: FC<Props> = ({ userEmail }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").slice(2, 3); // Берём сегменты 1-3, игнорируя пустые
  const currentPageName = pathSegments.join("/");

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 bg-card">
      <div className="flex w-full justify-between items-center gap-1 px-2 lg:gap-2 lg:px-4">
        <h1 className="text-base font-medium">
          {currentPageName === "object" ? "Объекты" : "Справочники"}{" "}
        </h1>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <ProfileDropdown
            trigger={<Button variant="ghost">{userEmail}</Button>}
          />
        </div>
      </div>
    </header>
  );
};
