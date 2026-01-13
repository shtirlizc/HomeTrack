import Link from "next/link";

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
    href: "messenger",
    label: "Мессенджеры",
  },
  {
    href: "phone",
    label: "Телефоны",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ul className="flex flex-wrap text-sm font-medium text-center text-body border-b border-default">
        {dictNav.map(({ href, label }) => (
          <li key={href} className="me-2">
            <Link
              href={`/admin/dict/${href}`}
              className="inline-block p-4 text-fg-brand bg-neutral-secondary-soft rounded-t-base active"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 md:gap-6 md:py-6 px-2 py-2">
        {children}
      </div>
    </div>
  );
}
