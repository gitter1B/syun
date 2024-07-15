import { Button } from "@/components/ui/button";
import { createSales } from "./actions";

export default async function TestPage() {
  return (
    <div className="p-8 grid grid-cols-2 items-center">
      <form
        action={async (formData: FormData) => {
          "use server";
          // await createSales();
        }}
      >
        <Button type="submit">更新</Button>
      </form>
    </div>
  );
}
