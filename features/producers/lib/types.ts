export type ProducerDTO = {
  id: string;
  name: string;
};

export type Producer = ProducerDTO & {
  password: string;
};
