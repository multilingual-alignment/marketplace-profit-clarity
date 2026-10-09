import type { ProductRecord } from "./products";
type Indexed<T> = T & Record<string, unknown>;
type Empty = { [_ in never]: never };
type ProfileRow = Indexed<{ id: string; email: string | null; created_at: string }>;
type ProfileInsert = Indexed<{ id: string; email?: string | null; created_at?: string }>;
type ProfileUpdate = Indexed<{ id?: string; email?: string | null; created_at?: string }>;
type ProductInsert = Indexed<Omit<ProductRecord, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string }>;
type ProductUpdate = Indexed<Partial<Omit<ProductInsert, "user_id">>>;
export type Database = {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: ProfileInsert; Update: ProfileUpdate; Relationships: [] };
      products: { Row: Indexed<ProductRecord>; Insert: ProductInsert; Update: ProductUpdate; Relationships: [] };
    };
    Views: Empty;
    Functions: Empty;
    Enums: Empty;
    CompositeTypes: Empty;
  };
};
