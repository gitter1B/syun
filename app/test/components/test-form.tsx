"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useTransition } from "react";

type Props = {
  action: () => void;
};
export const TestForm = ({ action }: Props) => {
  const [isPending, startTransition] = useTransition();
  return (
    <form
      action={() => {
        startTransition(async () => {
          await action();
        });
      }}
    >
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2Icon className="mr-2 animate-spin" />}
        Submit
      </Button>
    </form>
  );
};
