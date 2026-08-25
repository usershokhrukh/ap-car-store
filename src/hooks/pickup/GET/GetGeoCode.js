import { api } from "@/utils/api";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

const request = async (string) => {
  try {
    const res = await api.get(`/api/pickup-points/geocode${string || ''}`);
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message + `${error.response?.data?.errors?.length ? `${error?.response?.data?.errors?.map((item) => (`${item}`))}` : ""}` || "Could not resolve!");
    }
    throw new Error(error.message || "Something went wrong!");
  }
};
export const useGetGeoCode = (string) => {
  return useQuery({
    queryKey: ["geocode", string],
    queryFn: () =>  request(string),
  });
};
