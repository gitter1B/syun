import { NavItem } from "@/lib/types";
import {
  CalculatorIcon,
  HomeIcon,
  PackageIcon,
  PackageXIcon,
  TruckIcon,
} from "lucide-react";

export const linkItems: NavItem[] = [
  { href: "/", label: "ホーム", icon: <HomeIcon /> },
  {
    href: "/shipment",
    label: "出荷",
    icon: <TruckIcon />,
  },
  {
    href: "/sales",
    label: "販売",
    icon: <CalculatorIcon />,
  },
  {
    href: "/stock",
    label: "残数",
    icon: <PackageIcon />,
  },
  {
    href: "/waste",
    label: "回収／廃棄",
    icon: <PackageXIcon />,
  },
];
