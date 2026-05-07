import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";


export interface ILocation {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

interface UseLocationsReturn {
  locations: ILocation[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useLocations(): UseLocationsReturn {
  const { token } = useAuth();
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/location/s`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const json = await res.json();
      if (json.status) {
        const data = Array.isArray(json.data)
          ? json.data
          : json.data?.locations ?? json.data?.data ?? [];
        setLocations(data);
      } else {
        toast.error(json.message || "Failed to load locations");
      }
    } catch {
      toast.error("Network error loading locations");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, loading, refetch: fetchLocations };
}