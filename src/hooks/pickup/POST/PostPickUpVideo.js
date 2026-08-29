import {api} from "@/utils/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {useRef, useState} from "react";

const request = async ({
  formData,
  onProgress,
  id,
  cancelToken,
  onBytesMoving,
}) => {
  try {
    const res = await api.post(`/api/pickup-points/${id}/video`, formData, {
      onUploadProgress: (progressEvent) => {
        if (onBytesMoving) onBytesMoving();
        if (progressEvent.total && onProgress) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percent);
        }
      },

      cancelToken: cancelToken,
    });
    return res?.data;
  } catch (error) {    
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(
        error.response.data.message +
          `${error.response?.data?.errors?.length ? `${error?.response?.data?.errors?.map((item) => `${item}`)}` : ""}` ||
          "Could not resolve!",
      );
    }
    if (axios.isCancel(error)) {
      if(error?.message == "info") {
        return
      }else{
        throw new Error(error?.message || "Upload progress stopped due to the network error!");
      }
    }
    throw new Error(error.message || "Something went wrong!");
  }
};

export const usePostPickupVideo = () => {
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(true);
  const lastActiveTimeRef = useRef(Date.now());
  const monitorIntervalRef = useRef(null);
  const cancelTokenSourceRef = useRef(null);

  const stopMonitoring = () => {
    if (monitorIntervalRef.current) {
      clearInterval(monitorIntervalRef.current);
      monitorIntervalRef.current = null;
    }
    setIsSending(true);
  };

  const mutation = useMutation({
    mutationFn: ({formData, onProgress, id}) => {
      stopMonitoring();
      lastActiveTimeRef.current = Date.now();
      cancelTokenSourceRef.current = axios.CancelToken.source();
      setIsSending(true);
      const handleBytesMoving = () => {
        lastActiveTimeRef.current = Date.now();
        setIsSending(true);
      };

      monitorIntervalRef.current = setInterval(() => {
        const timeSinceLastUpdate = Date.now() - lastActiveTimeRef.current;

        if (timeSinceLastUpdate > (1000 * 60)) {
          setIsSending(false);
        }
      }, 2000);

      return request({
        formData,
        onProgress,
        id,
        cancelToken: cancelTokenSourceRef.current.token,
        onBytesMoving: handleBytesMoving,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["pickup"]});
      queryClient.invalidateQueries({queryKey: ["pickup-stats"]});
    },

    onSettled: () => {
      stopMonitoring();
    },
  });

  const forceCancelUpload = (text) => {
    if (cancelTokenSourceRef.current) {      
      cancelTokenSourceRef.current.cancel(text || "Upload progress stopped due to the network error!");
    }
    stopMonitoring();
  };

  return {
    ...mutation,
    isSending,
    forceCancelUpload,
  };
};
