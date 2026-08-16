import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios";
export const request = async (id) => {
try {
  const res = await api.delete(`/api/products/${id}`);
  return res?.data;
}catch(error) {
  if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
}
}
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess:() => {
      queryClient.invalidateQueries({queryKey: ["products"]})
    }
  })
}