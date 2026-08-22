import { api } from "@/utils/api";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

const request = async (id) => {
  try {
    const res = await api.get(`/api/admins/${id}`);
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message + error.response?.data?.errors?.[0] || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
  }
};

export const useGetOneAdmin = (id) => {
  return useQuery({
    queryKey: ["admins", id],
    queryFn: () => request(id),
    enabled: !!id
  });
};
