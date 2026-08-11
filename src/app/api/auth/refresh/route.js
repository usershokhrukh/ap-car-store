import axios from "axios";
import {cookies} from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const currentAccessToken = cookieStore.get("accessToken")?.value;
    if (!currentAccessToken) {
      cookieStore.delete("accessToken", {path: "/"});
      return Response.json({error: "Session non-existent"}, {status: 401});
    }

    try {
      const backendResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_KEY}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${currentAccessToken}`
          }
        }
      );
      if(!backendResponse?.data?.success) {
        return Response.json({error: backendResponse?.data?.message}, {status: backendResponse?.data?.status});
      }else{
        return Response.json({success: true, accessToken: currentAccessToken});
      }
    } catch (error) {
      cookieStore.delete("access_token", {path: "/"});
      if(axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message || "Could not resolve!")
    }
    throw new Error(error.message || "Something went wrong!")
    }
  } catch (error) {
    return Response.json({error: "Failed to store credentials"}, {status: 500});
  }
}
