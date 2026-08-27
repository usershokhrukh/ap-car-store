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
    const res = await api.post(`/api/pickup-points/${id}/image`, formData, {
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
      throw new Error("Upload progress stopped due to the network error!");
    }
    throw new Error(error.message || "Something went wrong!");
  }
};

export const usePostPickupImage = () => {
  const queryClient = useQueryClient();

  const [isSendingImage, setIsSendingImage] = useState(true);
  const lastActiveTimeRef = useRef(Date.now());
  const monitorIntervalRef = useRef(null);
  const cancelTokenSourceRef = useRef(null);

  const stopMonitoring = () => {
    if (monitorIntervalRef.current) {
      clearInterval(monitorIntervalRef.current);
      monitorIntervalRef.current = null;
    }
    setIsSendingImage(true);
  };

  const mutation = useMutation({
    mutationFn: ({formData, onProgress, id}) => {
      stopMonitoring();
      lastActiveTimeRef.current = Date.now();
      setIsSendingImage(true);
      cancelTokenSourceRef.current = axios.CancelToken.source();

      const handleBytesMoving = () => {
        lastActiveTimeRef.current = Date.now();
        setIsSendingImage(true);
      };

      monitorIntervalRef.current = setInterval(() => {
        const timeSinceLastUpdate = Date.now() - lastActiveTimeRef.current;
        if (timeSinceLastUpdate > (1000 * 60)) {
          setIsSendingImage(false);
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
  const forceCancelImageUpload = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel();
    }
    stopMonitoring();
  };

  return {
    ...mutation,
    isSendingImage,
    forceCancelImageUpload,
  };
};
