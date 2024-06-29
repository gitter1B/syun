import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, {
    message: "ユーザーネームを入力してください。",
  }),
  password: z.string().min(1, {
    message: "パスワードを入力してください。",
  }),
});
