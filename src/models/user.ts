export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  deleted_by: number | null;
}

export const defaultUser: User = {
  id: 0,
  name: '',
  email: '',
  password: '',
  role: 0,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  deleted_by: null,
};
