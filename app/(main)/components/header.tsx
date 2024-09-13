import { SideSheet } from "./side-sheet";
import { PageTitle } from "./page-title";
import { ProducerSelect } from "./producer-select";
import { ProducerDTO, Tables } from "@/lib/types";
import { getTables } from "@/lib/sheet";
import { convertProducersDTO } from "@/lib/convert-data";

export const Header = async () => {
  const tables: Tables = await getTables(["生産者"]);
  const producers: ProducerDTO[] = await convertProducersDTO(
    tables["生産者"].data
  );
  return (
    <header className="min-h-16 border-b flex items-center gap-2 px-4 py-2 md:px-8">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <SideSheet />
        </div>
      </div>
      <span className="flex-1 flex items-center pl-4">
        <PageTitle />
      </span>

      <ProducerSelect producers={producers} />
    </header>
  );
};
