import { createClient } from "@supabase/supabase-js";

// Mismo proyecto Supabase y misma llave anon que usa la app movil (ver
// frontend/src/core/routes-database/supabase.ts): solo lee vistas/tablas
// publicas (banners, categorias, etc), protegidas por RLS - el login real
// sigue siendo contra el backend NestJS, no Supabase Auth.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
