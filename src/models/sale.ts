export interface Sale {
  id: number;
  user_id: number;
  seller_id: number;
  amount: number | string;
  commission: number | string;
  made_at: Date | string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  deleted_by: number | null;
}

export const defaultSale: Sale = {
  id: 0,
  user_id: 0,
  seller_id: 0,
  amount: 0,
  commission: 0,
  made_at: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  deleted_by: null,
};