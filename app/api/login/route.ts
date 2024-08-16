import { convertUsers } from "@/lib/convert-data";
import { getTables } from "@/lib/sheet";
import { Tables, User } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const tables: Tables = await getTables(["ユーザー"]);
    const users: User[] = await convertUsers(tables["ユーザー"].data);

    const user: User | undefined = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return Response.json(null);
    }

    return Response.json(user);
  } catch (error) {
    console.error("Error:", error);
    return Response.json(null);
  }
}
