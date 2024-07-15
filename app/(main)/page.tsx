import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { TestChart } from "../test/components/test-chart";

export default async function Home() {
  const session = await auth();
  return (
    <div className="">
      <TestChart />
    </div>
  );
}
