import { api } from "@/utils/api";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

const request = async (payload) => {
  try {
    const res = await api.get(`/api/pickup-points/${payload[0]}/products${payload[1] || ''}`);
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message + `${error.response?.data?.errors?.length ? `${error?.response?.data?.errors?.map((item) => (`${item}`))}` : ""}` || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
  }
};
export const useGetPickupProducts = (payload) => {
  return useQuery({
    queryKey: ["pickup-products",payload[0], payload[1]],
    queryFn: () =>  request(payload),
    enabled: !!payload?.length
  });
};
