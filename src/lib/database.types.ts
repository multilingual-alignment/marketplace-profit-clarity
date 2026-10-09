import type { ProductRecord } from "./products";
type ProfileRow = { id: string; email: string | null; created_at: string };
type ProductInsert = Omit<ProductRecord, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
export type Database = {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: { id: string; email?: string | null; created_at?: string }; Update: { id?: string; email?: string | null; created_at?: string }; Relationships: [] };
      products: { Row: ProductRecord; Insert: ProductInsert; Update: Partial<Omit<ProductInsert, "user_id">>; Relationships: [] };
    };
    Views: Record<string, never>; Functions: Record<string, never>; Enums: Record<string, never>; CompositeTypes: Record<string, never>;
  };
};
