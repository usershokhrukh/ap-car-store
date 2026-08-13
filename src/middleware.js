import axios from "axios";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function middleware(request) {
  const cookieStore = await cookies();
  const token = request.cookies.get("accessToken")?.value;
  const {pathname} = request.nextUrl;
  // if (!token) {
  //   if (pathname.startsWith("/login")) {
  //     return NextResponse.next();
  //   } else {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // } else {
  //   try {
  //     const res = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}/api/auth/me`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   if (res?.data?.success) {
  //     if (pathname.startsWith("/login")) {
  //       return NextResponse.redirect(new URL("/", request.url));
  //     }
  //     return NextResponse.next();
  //   } else {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  //   }catch(error) {
  //     cookieStore.delete("accessToken", {path: "/"})
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  return NextResponse.next();

}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
