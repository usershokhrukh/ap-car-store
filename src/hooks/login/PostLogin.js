"use client";

import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

const request = async (data) => {
  try {
    const api_key = process.env.NEXT_PUBLIC_API_KEY;
    const res = await axios.post(`${api_key}/api/auth/login`, data);
    const {accessToken} = res.data?.data;    
    const cookieRes = await axios.post("/api/auth/login", {
      accessToken,
    });
    return res?.data;
  } catch (error) {
    if(axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message + error.response?.data?.errors?.[0] || "Could not resolve!")
    }
    throw new Error(error.message || "Something went wrong!")
  }
};

export const PostLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["login"]});
    },
  });
};