import { api } from "@/utils/api";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

const request = async (string) => {
  try {
    const res = await api.get(`/api/pickup-points/nearby${string}`);
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message + `${error.response?.data?.errors?.length ? `${error?.response?.data?.errors?.map((item) => (`${item}`))}` : ""}` || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
  }
};
export const useGetPickupNearby = (string) => {
  return useQuery({
    queryKey: ["pickup-nearby", string],
    queryFn: () => request(string),
    enabled: !!string
  });
};
