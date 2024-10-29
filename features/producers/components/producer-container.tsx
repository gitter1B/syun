import { ProducerSelect } from "@/features/producers/components/producer-select";
import { getProducersDTO } from "@/features/producers/lib/data";

export const ProducersContainer = async () => {
  const producers = await getProducersDTO();
  return <ProducerSelect producers={producers} />;
};
