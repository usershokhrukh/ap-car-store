import axios from "axios";
import {cookies} from "next/headers";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (token) {    
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_KEY}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    
    if (res?.data?.success) {
      return Response.json({success: true, accessToken: token});
    } else {
      return Response.json({error: "Login again!"}, {status: 401});
    }
  } else {
    return Response.json({error: "Failed to store credentials"}, {status: 500});
  }
}
