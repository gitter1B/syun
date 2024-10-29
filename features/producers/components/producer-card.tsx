"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { ChevronRightIcon } from "lucide-react";

import { ProducerDTO } from "@/features/producers/lib/types";

import { replaceProducerId } from "@/features/producers/lib/utils";

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
