"use client";
import { linkItems } from "@/lib/data";
import { ActiveLink } from "@/components/layout/active-link";
import { usePathname } from "next/navigation";
import { extractProducerId } from "@/features/producers/lib/utils";

export const Sidebar = () => {
  const pathname = usePathname();
  const producerId: string = extractProducerId(pathname);
  return (
    <div className="min-w-64 border-r hidden lg:inline-flex justify-center p-4">
      <nav className="flex flex-col gap-4 w-full">
        {linkItems.map(({ href, label, icon }) => {
          return (
            <ActiveLink
              key={href}
              href={`/producers/${producerId}${href}`}
              label={label}
              icon={icon}
            />
          );
        })}
      </nav>
    </div>
  );
};
