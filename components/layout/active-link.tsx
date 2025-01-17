"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const ActiveLink = ({ label, href, icon }: Props) => {
  const Icon: LucideIcon = icon;
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Button
      variant={"ghost"}
      asChild
      className={cn(
        "justify-start py-6 w-full transition-all duration-300",
        isActive && "bg-accent text-accent-foreground font-semibold"
      )}
    >
      <Link href={href} className="flex items-center">
        <Icon className="mr-4" />
        {label}
      </Link>
    </Button>
  );
};
