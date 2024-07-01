import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <div className="">
      <Link href={"/login"}>ログインページへ</Link>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button type="submit">ログアウト</Button>
      </form>
      <div>{JSON.stringify(session)}</div>
    </div>
  );
}
