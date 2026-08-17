import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios";
export const request = async (id) => {
try {
  const res = await api.delete(`/api/categories/${id}`);
  return res?.data;
}catch(error) {
  if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message + error.response?.data?.errors?.[0] || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
}
}
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess:() => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    }
  })
}