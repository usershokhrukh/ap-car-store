import {cookies} from "next/headers";

export async function POST(request) {
  try {
    const {accessToken} = await request.json();
    const cookieStore = await cookies();
    cookieStore.delete("accessToken", {path: "/"});
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 6,
    });
    return Response.json({success: true});
  } catch (err) {
    return Response.json({error: "Failed to store credentials"}, {status: 500});
  }
}