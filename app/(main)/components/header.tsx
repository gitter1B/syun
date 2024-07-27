import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { SideSheet } from "./side-sheet";
import { UserMenu } from "./user-menu";
import { PageTitle } from "./page-title";

export const Header = () => {
  return (
    <header className="min-h-16 border-b flex items-center px-4 md:px-8">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <SideSheet />
        </div>
        <Link href={"/"}>LOGO</Link>
      </div>

      <span className="flex-1 flex items-center justify-center">
        <PageTitle />
      </span>

      <div className="flex gap-4">
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
