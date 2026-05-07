/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useAuth } from "@/context/token";

interface LeaveType {
  id: number;
  title: string;
  days: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface LeaveTypesResponse {
  status: boolean;
  data: LeaveType[];
}

export const useLeaveTypes = () => {
  const { token } = useAuth();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaveTypes = async () => {
      if (!token) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/manage/leave/types`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result: LeaveTypesResponse = await response.json();

        if (result.status && Array.isArray(result.data)) {
          setLeaveTypes(result.data);
          setError(null);
        } else {
          setError("Failed to load leave types");
        }
      } catch (err) {
        console.error("Failed to load leave types:", err);
        setError(err instanceof Error ? err.message : "Failed to load leave types");
      } finally {
        setLoading(false);
      }
    };

    loadLeaveTypes();
  }, [token]);

  return { leaveTypes, loading, error };
};