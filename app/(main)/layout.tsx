import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex flex-1">
        <Sidebar />
        <div className="p-4 md:p-8 bg-muted/10 w-full">{children}</div>
      </main>
    </>
  );
}
