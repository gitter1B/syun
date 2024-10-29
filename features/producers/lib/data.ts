import "server-only";

import { cache } from "react";

import { Producer, ProducerDTO } from "@/features/producers/lib/types";

import { getTable } from "@/lib/sheet";

export const getAllProducers = cache(async (): Promise<Producer[]> => {
  const data: string[][] = await getTable("生産者");

  return data
    ? data.slice(1).map((row) => {
        return {
          id: row[0],
          password: row[1],
          name: row[2],
        };
      })
    : [];
});

export const getProducer = cache(
  async (producerId: string): Promise<Producer | null> => {
    const producers: Producer[] = await getAllProducers();
    const producer: Producer | undefined = producers.find(
      (p) => p.id === producerId
    );
    if (!producer) {
      return null;
    }
    return producer;
  }
);

export const getProducersDTO = cache(async (): Promise<ProducerDTO[]> => {
  const data: string[][] = await getTable("生産者");

  return data
    ? data.slice(1).map((row) => {
        return {
          id: row[0],
          name: row[2],
        };
      })
    : [];
});
