import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

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

export function useDepartments() {
  const { token } = useAuth();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);

}