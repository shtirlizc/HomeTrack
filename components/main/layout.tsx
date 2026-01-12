import { ModeToggle } from "@/components/common/dark-mode/mode-toggle";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="bg-card sticky top-0 z-50 border-b flex items-center justify-between gap-6 px-4 py-2">
        <a href="#">Logo</a>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <button>Позвонить</button>
        </div>
      </header>

      <main className="px-4 py-2">{children}</main>

      <footer className="bg-card h-10 border-t px-4 py-2 text-center">
        ИЖС Уфа
      </footer>
    </>
  );
}
