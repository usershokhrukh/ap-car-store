import {api} from "@/utils/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

const request = async (payload) => {  
  try {
    const res = await api.delete(`/api/pickup-points/${payload}/image`);
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(
        error.response.data.message + `${error.response?.data?.errors?.length ? `${error?.response?.data?.errors?.map((item) => (`${item}`))}` : ""}` ||
          "Could not resolve!",
      );
    }
    throw new Error(error.message || "Something went wrong!");
  }
};

export const useDeletePickupImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["pickup"]});
      queryClient.invalidateQueries({queryKey: ["pickup-stats"]});
    },
  });
};
