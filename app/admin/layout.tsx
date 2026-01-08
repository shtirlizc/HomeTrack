import type { Metadata } from "next";

import { ProfileDropdown } from "@/components/admin/dropdown-profile";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/dark-mode/mode-toggle";

export const metadata: Metadata = {
  title: "Админка - ИЖС Уфа",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header className="bg-card sticky top-0 z-50 border-b flex items-center justify-between gap-6 px-4 py-2">
        <a href="#">Logo</a>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <ProfileDropdown
            trigger={
              <Button variant="ghost" className="cursor-pointer">
                User Name
              </Button>
            }
          />
        </div>
      </header>

      <main className="px-4 py-2">{children}</main>

      <footer className="bg-card h-10 border-t">ИЖС Уфа</footer>
    </div>
  );
}
