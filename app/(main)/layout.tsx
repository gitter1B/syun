import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex flex-1">
        <Sidebar />
        <div className="p-4 md:p-8 bg-muted/10 w-full flex-1">{children}</div>
        <Toaster />
      </main>
    </>
  );
}
