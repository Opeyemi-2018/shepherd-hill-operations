"use server";

interface ApiStaff {
  id: number;
  staff_member: {
    full_name: string;
    initials: string;
  };
  name: string;
  email: string;
  role: string;
  resume_time: string;
  status: string;
  rating: number | null;
  rating_formatted: string;
}

interface StaffResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: ApiStaff[];
  };
}

export async function getClientStaff(token: string): Promise<ApiStaff[]> {
  try {
    if (!token) {
      throw new Error("Authentication token is required");
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/client/staff`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch staff: ${res.status} ${res.statusText}`);
    }

    const json: StaffResponse = await res.json();

    if (!json.status || !json.data?.data) {
      throw new Error(json.message || "Invalid response format from staff endpoint");
    }

    return json.data.data;
  } catch (error) {
    console.error("[getClientStaff error]", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to load client staff members");
  }
}
export async function fetchStaff(token: string) {
  try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/staff`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
    );

    // Return status code so client can handle it
    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        statusCode: res.status,
        error: "Unauthorized",
      };
    }

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        statusCode: res.status,
        error: errorText || "Failed to fetch staff data",
      };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// get stff detail
export async function fetchStaffDetails(
    token: string,
    staffId: string | number,
) {
  try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/staff/details/${staffId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
    );

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        statusCode: res.status,
        error: "Unauthorized",
      };
    }

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        statusCode: res.status,
        error: errorText || "Failed to fetch staff details",
      };
    }

    const data = await res.json();
    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}