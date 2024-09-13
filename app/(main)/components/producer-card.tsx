"use client";
import { Producer, ProducerDTO } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
import { ActiveLink } from "./active-link";
import { linkItems } from "@/lib/data";
import { replaceProducerId } from "@/lib/utils";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

type Props = {
  producer: ProducerDTO;
};

export const ProducerCard = ({ producer }: Props) => {
  const { id, name } = producer;
  const pathname = usePathname();
  const href: string = replaceProducerId(pathname, id);

  return (
    <Link
      className="border rounded-sm shadow-sm flex items-center justify-between p-4 gap-2"
      href={href}
    >
      <div className="truncate">{name}</div>
      <ChevronRightIcon />
    </Link>
  );
};
