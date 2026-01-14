import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/dark-mode/mode-toggle";
import { ProfileDropdown } from "@/components/admin/dropdown-profile";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 bg-card">
      <div className="flex w-full justify-between items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium">Title</h1>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <ProfileDropdown
            trigger={<Button variant="ghost">User Name</Button>}
          />
        </div>
      </div>
    </header>
  );
}
