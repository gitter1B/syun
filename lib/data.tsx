import { NavItem } from "@/lib/types";
import {
  CalculatorIcon,
  HomeIcon,
  PackageIcon,
  PackageXIcon,
  TruckIcon,
} from "lucide-react";

export const linkItems: NavItem[] = [
  { href: "/dashboard", label: "ホーム", icon: HomeIcon },
  {
    href: "/shipments",
    label: "出荷",
    icon: TruckIcon,
  },
  {
    href: "/sales",
    label: "売上",
    icon: CalculatorIcon,
  },
  {
    href: "/stocks",
    label: "残数",
    icon: PackageIcon,
  },
  {
    href: "/wastes",
    label: "回収／廃棄",
    icon: PackageXIcon,
  },
];
