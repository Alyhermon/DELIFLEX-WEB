export type User = {
  id: string;
  email: string;
  username: string;
  phone: string | null;
  global_role_id: number | null;
  type_user: string;
};
