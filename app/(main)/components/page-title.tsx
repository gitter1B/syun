"use client";

import { linkItems } from "@/lib/data";
import { usePathname } from "next/navigation";

export const PageTitle = () => {
  const pathname = usePathname();
  const title: string | undefined = linkItems.find((item) =>
    pathname.includes(item.href)
  )?.label;
  return <div className="text-xl font-semibold">{title}</div>;
};
