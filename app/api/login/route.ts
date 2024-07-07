import { getAllUsers } from "@/actions/user";
import { getSheets } from "@/lib/sheet";
import { User } from "@/lib/types";
import { sheets_v4 } from "googleapis";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const sheets: sheets_v4.Sheets = await getSheets();
    const users: User[] = await getAllUsers(sheets);

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
