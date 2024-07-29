"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon, LogOutIcon, UserIcon } from "lucide-react";
import { logout } from "@/app/(auth)/login/actions";
import { useTransition } from "react";

export const UserMenu = () => {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>アカウント</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            startTransition(async () => {
              await logout();
            });
          }}
          className="cursor-pointer"
        >
          {isPending ? (
            <Loader2Icon className="animate-spin mr-2" size={20} />
          ) : (
            <LogOutIcon className="mr-2" size={20} />
          )}
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
