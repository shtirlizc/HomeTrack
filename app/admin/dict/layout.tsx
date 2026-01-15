import { NavMenu } from "@/components/admin/dict/nav-menu";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavMenu />

      <div className="flex flex-col gap-4 md:gap-6 md:py-6 px-4 py-2">
        {children}
      </div>
    </div>
  );
}
