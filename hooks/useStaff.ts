/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { fetchStaff, fetchStaffDetails } from "@/actions/staff";
import { useAuth } from "@/context/AuthContext";


interface StaffResponse {
  status: boolean;
  staff: {
    total: number;
    onfield: number;
    deployed: number;
    inactive: number;
    staff_data: Array<{
      id: number;
      user_id: string;
      name: string;
      // ... other staff properties
    }>;
  };
}

export const useStaff = () => {
  const { token } = useAuth();
  const [staffData, setStaffData] = useState<StaffResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaffData = async () => {
      if (!token) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await fetchStaff(token);

        if (!result.success) {
          setError(result.error || "Failed to load staff data");
          return;
        }

        setStaffData(result.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load staff data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load staff data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadStaffData();
  }, [token]);

  return { staffData, loading, error };
};



export interface StaffDetailsResponse {
  details: {
    payment_cycle: string;
    include_weekends: string;
    designation: any;
    location: any;
    created_at: string | number | Date;
    payroll_type: string;
    deployed: string;
    joined_at: string;           
    passport?: string;        
    staff_type: string;
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    nationality: string;
    
    nin: string;
    department: {
      id: any; name: string 
};
    // ... add more if needed
  };
  documents: any[];
  equipment: any[];
    attendance: {          
    id: number;
    employee_id: string;
    date: string;
    status: string;
    clock_in: string | null;
    clock_out: string | null;
    late: string | null;
    early_leaving: string | null;
    overtime: string | null;
    created_at: string;
    updated_at: string;
  }[];
  deployment: {
    deployment_duration: string;
    current_deployment: any;
    deployments: any[];
  };
  payment: any;
}

export const useStaffDetails = (staffId: string | number) => {
  const { token } = useAuth();
  const [data, setData] = useState<StaffDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!staffId || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);

      const result = await fetchStaffDetails(token, staffId);

      if (!result.success) {
        setError(result.error || "Failed to load staff details");
      } else {
        setData(result.data);
      }
      setLoading(false);
    };

    load();
  }, [staffId, token]);

  return { data, loading, error };
};
