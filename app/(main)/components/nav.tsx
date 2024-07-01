import { NavItem } from "@/lib/types";
import { ActiveLink } from "./active-link";

type Props = {
  linkItems: NavItem[];
};
export const Nav = ({ linkItems }: Props) => {
  return (
    <nav className="flex flex-col gap-4 w-full">
      {linkItems.map(({ href, label, icon }) => {
        return <ActiveLink key={href} href={href} label={label} icon={icon} />;
      })}
    </nav>
  );
};
