import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { SideSheet } from "./side-sheet";

export const Header = () => {
  return (
    <header className="h-16 border-b flex items-center px-8">
      <div className="flex items-center gap-4">
        <SideSheet />
        <Link href={"/"}>LOGO</Link>
      </div>
      <span className="flex-1"></span>
      <ModeToggle />
    </header>
  );
};
