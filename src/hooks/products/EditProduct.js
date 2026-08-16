import {api} from "@/utils/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
const request = async (payload) => {
  try {
    const res = await api.put(`/api/products/${payload[0]}`, payload[1]);
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message + error.response?.data?.errors?.[0] || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
  }
};
export const useEditProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["products"]});
      queryClient.invalidateQueries({queryKey: ["dashboard-low-stock"]})
    },
  });
};
