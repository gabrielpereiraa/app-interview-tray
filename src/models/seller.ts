export interface Seller {
  id: number;
  created_by: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  deleted_by: number | null;
}

export const defaultSeller: Seller = {
  id: 0,
  created_by: 0,
  name: "",
  email: "",
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  deleted_by: null,
};