import { Suspense } from "react";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { HeaderSkeleton } from "./components/header-skeleton";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main className="flex flex-1">
        <Sidebar />
        <div className="p-4 md:p-8 bg-muted/10 w-full">{children}</div>
        <Toaster />
      </main>
    </>
  );
}
