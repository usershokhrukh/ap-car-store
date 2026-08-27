import {api} from "@/utils/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

const request = async ({formData, onProgress, id}) => {  
  try {
    const res = await api.post(`/api/pickup-points/${id}/video`, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percent);
        }
      },
    });
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

export const usePostPickupVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({formData, onProgress, id}) => request({formData, onProgress, id}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["pickup"]});
      queryClient.invalidateQueries({queryKey: ["pickup-stats"]});
    },
  });
};