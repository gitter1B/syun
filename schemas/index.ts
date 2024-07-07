import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, {
    message: "ユーザーネームを入力してください。",
  }),
  password: z.string().min(1, {
    message: "パスワードを入力してください。",
  }),
});

export const ShipmentSchema = z.object({
  product: z.string().min(1, { message: "店舗を選択してください。" }),
  unitPrice: z
    .string()
    .min(1, { message: "価格を入力してください。" })
    .regex(/^\d*$/, "数字のみを入力してください"),
  quantity: z
    .string()
    .min(1, { message: "個数を入力してください。" })
    .regex(/^\d*$/, "数字のみを入力してください"),
});
