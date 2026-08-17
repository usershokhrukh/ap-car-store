import { api } from "@/utils/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

const request = async (payload) => {
  try {
    const res = await api.post(`api/categories`, payload);
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
  }
};
export const usePostCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]});
    },
  });
};
