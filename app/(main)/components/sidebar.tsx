import { linkItems } from "@/lib/data";
import { Nav } from "./nav";

export const Sidebar = () => {
  return (
    <div className="min-w-64 border-r hidden md:inline-flex justify-center p-4">
      <Nav linkItems={linkItems} />
    </div>
  );
};
