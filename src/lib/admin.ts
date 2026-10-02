import { supabase } from "@/lib/supabase";

export async function isCurrentUserAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase.rpc("is_admin");

  if (error) {
    console.error("Error comprobando administrador:", error);
    return false;
  }

  return data === true;
}