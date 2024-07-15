"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  stores: Store[];
};

export const StoreTabs = ({ stores }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Tabs
      defaultValue={stores[0].id}
      className="w-[400px]"
      onValueChange={(value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("storeId", value);
        router.push(`${pathname}?${params.toString()}`);
      }}
    >
      <TabsList>
        {stores.map((store) => {
          return (
            <TabsTrigger key={store.id} value={store.id}>
              {store.name}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {stores.map((store) => {
        return (
          <TabsContent key={store.id} value={store.id}>
            {store.name}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};
