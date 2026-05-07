"use server";

import { AddClientFormValues, AddClientResult } from "@/types/clientTypes";
import { revalidatePath } from "next/cache";

export async function fetchClients(token: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/operations/client/s`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return {
        success: false,
        statusCode: res.status,
        error: "Failed to fetch client data",
      };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("fetchClients error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function addClientAction(
  payload: AddClientFormValues,
  token: string,
  logoFile: File | null,
  slaFile: File | null,
): Promise<AddClientResult> {
  try {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("address", payload.address || "");
    formData.append("location", payload.location);
    formData.append("service", payload.service);

    // formData.append("staff_number", payload.staff_number);
    // formData.append("start_date", payload.start_date);
    // formData.append("end_date", payload.end_date);

    payload.contact_person.forEach((contact, index) => {
      formData.append(
        `contact_person[${index}][contact_name]`,
        contact.contact_name,
      );
      formData.append(
        `contact_person[${index}][contact_email]`,
        contact.contact_email,
      );
      formData.append(
        `contact_person[${index}][contact_phone]`,
        contact.contact_phone,
      );
    });

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    if (slaFile) {
      formData.append("sla", slaFile);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/businessdevelopemt/client/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const responseData = await res.json();

    if (!res.ok) {
      if (responseData.errors) {
        const errorMessages = Object.entries(responseData.errors)
          .map(([field, errors]) => {
            const fieldErrors = (errors as string[]).join(", ");
            return `${field}: ${fieldErrors}`;
          })
          .join("; ");

        return {
          success: false,
          error: `Validation failed: ${errorMessages}`,
        };
      }

      return {
        success: false,
        error: responseData.message || "Failed to create client",
      };
    }

    if (!responseData.status) {
      return {
        success: false,
        error: responseData.message || "Failed to create client",
      };
    }

    return {
      success: true,
      message: responseData.message || "Client created successfully",
      data: responseData.data,
    };
  } catch (error) {
    console.error("addClientAction error:", error);
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
}

export async function fetchClientById(token: string, clientId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/client/details/${clientId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return {
        success: false,
        statusCode: res.status,
        error: "Failed to fetch client details",
      };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("fetchClientById error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteClientAction(
  clientId: string,
  token: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    if (!clientId || !token) {
      return {
        success: false,
        error: "Missing client ID or authentication token",
      };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/client/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_id: clientId,
        }),
      },
    );

    if (!res.ok) {
      let errorMessage = `Server responded with ${res.status}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {}
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await res.json();

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      message: data.message || data.data || "Client deleted successfully",
    };
  } catch (error) {
    console.error("deleteClientAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete client – network or server error",
    };
  }
}

export async function resolveComplaintAction(
  complaintId: string,
  token: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    if (!complaintId || !token) {
      return {
        success: false,
        error: "Missing complaint ID or authentication token",
      };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/complaint/resolve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaint_id: complaintId,
        }),
      },
    );

    if (!res.ok) {
      let errorMessage = `Server responded with ${res.status}`;
      try {
        const errData = await res.json();
        errorMessage = errData.message || errData.error || errorMessage;
      } catch {}
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await res.json();

    revalidatePath("/dashboard/clients/[id]");

    return {
      success: true,
      message: data.message || "Complaint resolved successfully",
    };
  } catch (error) {
    console.error("resolveComplaintAction error:", error);
    return {
      success: false,
      error: "Failed to resolve complaint – network or server error",
    };
  }
}

export async function deleteComplaintAction(
  complaintId: string,
  token: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    if (!complaintId || !token) {
      return {
        success: false,
        error: "Missing complaint ID or authentication token",
      };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/complaint/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaint_id: complaintId,
        }),
      },
    );

    if (!res.ok) {
      let errorMessage = `Server responded with ${res.status}`;
      try {
        const errData = await res.json();
        errorMessage = errData.message || errData.error || errorMessage;
      } catch {}
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await res.json();

    revalidatePath("/dashboard/clients/[id]");

    return {
      success: true,
      message: data.message || "Escalation deleted successfully",
    };
  } catch (error) {
    console.error("deleteComplaintAction error:", error);
    return {
      success: false,
      error: "Failed to delete escalation – network or server error",
    };
  }
}
