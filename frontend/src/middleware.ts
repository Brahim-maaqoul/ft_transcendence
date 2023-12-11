import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import axios, { AxiosResponse } from "axios";
import next from "next";


export async function middleware(request: NextRequest, res: NextResponse) {
  const jwtCookie = request.cookies.get("token")?.value;
  if (!jwtCookie)
  {
    if (request.nextUrl.pathname === "/login")
      return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url).toString());
  }
  console.log("h111erere")
  if (request.nextUrl.pathname === "/login")
  {
    console.log("herere")
    const response = NextResponse.redirect(new URL("/login", request.url).toString())
    response.cookies.delete('token')
    return response

  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next).*)"],
};
