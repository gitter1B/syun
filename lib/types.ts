import { type LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type Item = {
  value: string;
  label: string;
};

export type Tables = { [key: string]: { header: string[]; data: string[][] } };
