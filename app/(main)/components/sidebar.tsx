import { linkItems } from "@/lib/data";
import { ActiveLink } from "./active-link";

export const Sidebar = () => {
  return (
    <div className="min-w-64 border-r hidden lg:inline-flex justify-center p-4">
      <nav className="flex flex-col gap-4 w-full">
        {linkItems.map(({ href, label, icon }) => {
          return (
            <ActiveLink key={href} href={href} label={label} icon={icon} />
          );
        })}
      </nav>
    </div>
  );
};
