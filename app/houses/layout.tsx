import MainLayout from "@/components/main/layout";

export default async function HousesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4 md:gap-6">{children}</div>
    </MainLayout>
  );
}
