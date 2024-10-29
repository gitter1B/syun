import "server-only";

import { cache } from "react";

import { getTable } from "@/lib/sheet";

import { User } from "@/features/users/lib/types";

export const getAllUsers = cache(async (): Promise<User[]> => {
  const data: string[][] = await getTable("ユーザー");
  return data
    ? data.slice(1).map((row) => {
        return {
          id: row[0],
          username: row[1],
          password: row[2],
        };
      })
    : [];
});
