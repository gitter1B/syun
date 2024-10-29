import { User } from "@/features/users/lib/types";

import { getAllUsers } from "@/features/users/lib/data";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const users: User[] = await getAllUsers();

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
