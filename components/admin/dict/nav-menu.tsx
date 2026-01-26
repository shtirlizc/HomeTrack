"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const dictNav = [
  {
    href: "district",
    label: "Районы",
  },
  {
    href: "developer",
    label: "Застройщики",
  },
  {
    href: "region",
    label: "Регионы",
  },
  {
    href: "messenger",
    label: "Мессенджеры",
  },
  {
    href: "phone",
    label: "Телефоны",
  },
];

export function NavMenu() {
  const pathname = usePathname();
  const currentPageName = pathname.split("/").at(-1);

  return (
    <ul className="flex flex-wrap text-sm font-medium text-center text-body border-b border-default">
      {dictNav.map(({ href, label }) => (
        <li key={href} className="me-2">
          <Link
            href={`/admin/dict/${href}`}
            className={`inline-block p-4 transition-colors text-sm font-medium hover:text-blue-500
    ${currentPageName === href && "font-semibold border-b-2 border-primary text-primary"}`}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
