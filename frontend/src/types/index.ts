export type Tag = {
  id: number;
  name: string;
  children?: Tag[];
  data?: string;
};
