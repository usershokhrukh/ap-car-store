import {cookies} from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken", {path: "/"});
    return Response.json({message: "Successfully logged out", success: true});
  } catch (error) {
    console.log(error);
    
    return Response.json({error}, {status: 500});
  }
}
