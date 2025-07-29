import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error fetching user:", error?.message);
        setRole(null);
        setLoading(false);
        return;
      }

      const role = user.user_metadata?.role ?? null;
      setRole(role);
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  return { role, loading };
}
