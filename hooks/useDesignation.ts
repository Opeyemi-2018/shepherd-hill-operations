import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/token";

export interface IDesignation {
  id: number;
  name: string;
  department_id?: string | number;
  department?: { id: number; name: string } | null;
  created_at: string;
  updated_at?: string;
}

interface UseDesignationsReturn {
  designations: IDesignation[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useDesignations(): UseDesignationsReturn {
  const { token } = useAuth();
  const [designations, setDesignations] = useState<IDesignation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDesignations = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/designation/s`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const json = await res.json();
      if (json.status) {
        setDesignations(json?.data?.designation?.data ?? []);
      } else {
        toast.error(json.message || "Failed to load designations");
      }
    } catch {
      toast.error("Network error loading designations");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  return { designations, loading, refetch: fetchDesignations };
}