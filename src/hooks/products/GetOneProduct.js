import { api } from "@/utils/api";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

const request = async (id) => {
  try {
    const res = await api.get(`/api/products/${id}`);
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
  }
};

export const useGetOneProduct = (id) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => request(id),
  });
};
