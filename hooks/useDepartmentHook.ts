import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/token";
import { getDepartments } from "@/actions/department";

export interface IDepartment {
  id: number;
  name: string;
  created_at: string;
  branch_id: string;
  created_by: string;
  updated_at?: string;
}

interface UseDepartmentsReturn {
  departments: IDepartment[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useDepartments(): UseDepartmentsReturn {
  const { token } = useAuth();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await getDepartments(token);
      if (result.success && Array.isArray(result.data)) {
        setDepartments(result.data);
      } else {
        toast.error(result.message || "Failed to load departments");
      }
    } catch {
      toast.error("Error fetching departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [token]);

  return { departments, loading, refetch: fetchDepartments };
}