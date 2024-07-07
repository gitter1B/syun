"use server";

import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "型が無効です" };
  }

  const { username, password } = validatedFields.data;
  try {
    const resultSignIn = await signIn("credentials", {
      username,
      password,
      redirectTo: "/",
    });

    if (!resultSignIn) {
      return { error: "ログインに失敗しました。" };
    }
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};

export const logout = async () => {
  await signOut({ redirectTo: "/login" });
};
