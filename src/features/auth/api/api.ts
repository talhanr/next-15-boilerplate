// server side rendering requests

import { apiServices } from "@/services/fetch/api-services";

export const fetchAllServerSideData = async () => {
  try {
    const response = await apiServices.readUser({
      config: { cache: "no-store" },
    });
    if (response?.data) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: true,
        error: "No data returned from provinces API",
      };
    }
  } catch (err: any) {
    console.error("Error fetching province data:", err);

    return {
      success: false,
      error:
        err?.message || "An error occurred while fetching the province data",
    };
  }
};
