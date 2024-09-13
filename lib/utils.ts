import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractProducerId = (pathname: string): string => {
  const match = pathname.match(/\/producers\/(\d+)(\/[^\/]*)?$/);

  if (match) {
    return match[1];
  } else {
    return "";
  }
};

export const replaceProducerId = (
  pathname: string,
  newProducerId: string
): string => {
  return pathname.replace(
    /\/producers\/\d+\/([^\/]+)/,
    `/producers/${newProducerId}/$1`
  );
};
