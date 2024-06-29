import { getUsers } from "@/actions/users";
import { getSheets } from "@/lib/sheet";
import { User } from "@/lib/types";
import { sheets_v4 } from "googleapis";

export async function GET(req: Request) {
  try {
    const username: string = req.headers.get("username") as string;
    const password: string = req.headers.get("password") as string;

    const sheets: sheets_v4.Sheets = await getSheets();
    const users: User[] = await getUsers(sheets);

    const user: User | undefined = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
