import { TestForm } from "./components/test-form";
import { testAction } from "./actions";

export default async function TestPage() {
  return (
    <div className="flex items-center justify-center p-8 h-dvh">
      <TestForm action={testAction} />
    </div>
  );
}
