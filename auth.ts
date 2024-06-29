import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { User } from "./lib/types";

export const { handlers, signIn, signOut, auth } = NextAuth({
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

        const { username, password } = validatedFields.data;

        const res = await fetch(
          `${process.env.PREFIX}${process.env.VERCEL_URL}/api/user`,
          {
            headers: {
              username: username,
              password: password,
            },
          }
        );

        const user: User | null = (await res.json()) as User | null;

        if (!user) {
          return null;
        }

        return { id: user.id, name: user.username };
      },
    }),
  ],
});
