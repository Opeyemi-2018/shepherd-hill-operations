"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchClients, fetchClientById } from "@/actions/client";
import { ClientResponse, ClientDetailsFullResponse } from "@/types/clientTypes";

// Hook for list of clients
export const useClient = () => {
  const { token } = useAuth();
  const [clientData, setClientData] = useState<ClientResponse | null>(null);
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
        const result = await fetchClients(token);

        if (!result.success) {
          setError(result.error || "Failed to load clients");
          return;
        }

        setClientData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  return { clientData, loading, error };
};

export const useClientDetails = (clientId: string) => {
  const { token } = useAuth();
  const [clientDetails, setClientDetails] = useState<ClientDetailsFullResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token || !clientId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await fetchClientById(token, clientId);

      if (result.success && result.data) {
        setClientDetails(result.data);
      } else {
        setError(result.error || "Failed to load client details");
      }

      setLoading(false);
    };

    load();
  }, [clientId, token]);

  return { clientDetails, loading, error };
};