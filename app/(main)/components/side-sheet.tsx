"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Nav } from "./nav";
import { linkItems } from "@/lib/data";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { ActiveLink } from "./active-link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const SideSheet = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <MenuIcon size={32} />
      </SheetTrigger>
      <SheetContent side={"left"} aria-describedby={undefined}>
        <SheetTitle></SheetTitle>
        <SheetHeader className="mb-8 px-2 -mt-2">
          <div className="flex items-center gap-4">
            <SheetClose asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                asChild
                className="cursor-pointer p-1"
              >
                <MenuIcon />
              </Button>
            </SheetClose>

            <SheetClose asChild>
              <Link href={"/"}>LOGO</Link>
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="flex flex-col gap-4 w-full">
          {linkItems.map(({ href, label, icon }) => {
            return (
              <div key={href} className="w-full" onClick={() => setOpen(false)}>
                <ActiveLink href={href} label={label} icon={icon} />
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
