import { linkItems } from "@/lib/data";
import { Nav } from "./nav";

export const Sidebar = () => {
  return (
    <div className="w-60 border-r hidden lg:inline-flex justify-center p-4">
      <Nav linkItems={linkItems} />
    </div>
  );
};
