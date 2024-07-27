"use client";

import { linkItems } from "@/lib/data";
import { usePathname } from "next/navigation";

export const PageTitle = () => {
  const pathname = usePathname();

  const title: string | undefined = linkItems.find(
    (item) => item.href === pathname
  )?.label;
  return <div className="text-lg font-semibold">{title}</div>;
};
