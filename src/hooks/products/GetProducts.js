import { api } from "@/utils/api";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

const request = async (string) => {
  try {
    const res = await api.get(`/api/products/${string}`);
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
  }
};

export const useGetProducts = (string) => {
  return useQuery({
    queryKey: ["products", string],
    queryFn: () => request(string),
  });
};
