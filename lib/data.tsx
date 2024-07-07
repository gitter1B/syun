import { NavItem } from "@/lib/types";
import { format as formatTz } from "date-fns-tz";
import { HomeIcon, TruckIcon } from "lucide-react";

export const linkItems: NavItem[] = [
  { href: "/", label: "ホーム", icon: <HomeIcon /> },
  {
    href: "/shipment",
    label: "出荷",
    icon: <TruckIcon />,
  },
];
