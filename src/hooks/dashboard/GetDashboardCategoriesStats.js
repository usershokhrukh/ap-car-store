import { api } from "@/utils/api";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
const request = async () => {
  try {
    const res = await api.get("/api/dashboard/category-stats");
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message + `${error.response?.data?.errors?.length ? `${error?.response?.data?.errors?.map((item) => (`${item}`))}` : ""}` || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
  }
};
export const useGetDashboardCategoriesStats = () => {
  return useQuery({
    queryKey: ["categoriesStats"],
    queryFn: request,
  });
};
