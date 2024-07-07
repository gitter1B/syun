import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { SideSheet } from "./side-sheet";
import { UserMenu } from "./user-menu";

export const Header = () => {
  return (
    <header className="min-h-16 border-b flex items-center px-4 md:px-8">
      <div className="flex items-center gap-4">
        <SideSheet />
        <Link href={"/"}>LOGO</Link>
      </div>
      <span className="flex-1"></span>
      <div className="flex gap-2">
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
