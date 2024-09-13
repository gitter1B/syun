"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { linkItems } from "@/lib/data";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { ActiveLink } from "./active-link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { extractProducerId } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { UserMenu } from "./user-menu";

export const SideSheet = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const producerId: string = extractProducerId(pathname);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex items-center">
        <MenuIcon size={20} />
      </SheetTrigger>
      <SheetContent side={"left"} aria-describedby={undefined}>
        <SheetTitle></SheetTitle>
        <SheetHeader className="mb-8 px-2 -mt-2"></SheetHeader>

        <div className="flex flex-col gap-4 w-full">
          {linkItems.map(({ href, label, icon }) => {
            return (
              <div key={href} className="w-full" onClick={() => setOpen(false)}>
                <ActiveLink
                  href={`/producers/${producerId}${href}`}
                  label={label}
                  icon={icon}
                />
              </div>
            );
          })}
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center gap-3">
            <ModeToggle />
            <span>明るさ</span>
          </div>
          <div className="flex items-center gap-3">
            <UserMenu />
            <span>アカウント</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
