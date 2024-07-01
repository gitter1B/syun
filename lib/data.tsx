import { NavItem } from "@/lib/types";
import { HomeIcon, TruckIcon } from "lucide-react";

export const linkItems: NavItem[] = [
  { href: "/", label: "ホーム", icon: <HomeIcon /> },
  { href: "/shipment", label: "出荷", icon: <TruckIcon /> },
];
