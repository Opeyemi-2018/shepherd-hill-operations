// hooks/useServices.ts
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";


interface ServiceGrade {
  id: number;
  name: string;
  rate: string;
  status: string;
}

interface ServicesResponse {
  status: boolean;
  data: ServiceGrade[];
}

export const useServices = () => {
  const { token } = useAuth();
  const [servicesData, setServicesData] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setError("No authentication token");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `https://shepherdhill.edubiller.com/api/admin/finance/services`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data: ServicesResponse = await res.json();
        setServicesData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  return { servicesData, loading, error };
};