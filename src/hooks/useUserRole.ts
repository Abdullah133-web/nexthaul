import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null); // ✅ OK
  const [loading, setLoading] = useState<boolean>(true); // ✅ OK

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setLoading(false);
        return;
      }

      const role = data.user?.user_metadata?.role ?? null;
      setRole(role);
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  return { role, loading };
}
