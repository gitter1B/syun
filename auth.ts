import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { User } from "./lib/types";
import { headers } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  callbacks: {
    session: async ({ session, token }) => {
      session.user.id = token.sub as string;
      return session;
    },
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }
        const headersList = headers();
        const proto: string | null = headersList.get("x-forwarded-proto");
        const host: string | null = headersList.get("x-forwarded-host");

        const res = await fetch(`${proto}://${host}/api/login`, {
          method: "POST",
          body: JSON.stringify(validatedFields.data),
          headers: { "Content-Type": "application/json" },
        });

        const user: User = await res.json();

        if (!user) {
          return null;
        }

        return { id: user.id, name: user.username };
      },
    }),
  ],
});
