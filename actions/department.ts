/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/department.ts
"use server";

import { revalidatePath } from "next/cache";

export async function getDepartmentDetails(id: string | number, token: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API base URL not set");

    const res = await fetch(`${apiUrl}/api/admin/department/details/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `Failed to fetch department #${id}`,
        error: errorData,
      };
    }

    const json = await res.json();

    if (!json.status || !json.data?.department) {
      return {
        success: false,
        message: "Invalid department response format",
      };
    }

    return {
      success: true,
      data: json.data.department,
      message: json.message || "Department fetched successfully",
    };
  } catch (error) {
    console.error("Fetch department details error:", error);
    return {
      success: false,
      message: "Server error while loading department details",
      error,
    };
  }
}
