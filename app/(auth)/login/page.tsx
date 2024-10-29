import { LoginForm } from "@/features/users/components/login-form";

export default async function LoginPage() {
  return (
    <div className="flex flex-col gap-4">
      <LoginForm />
    </div>
  );
}
