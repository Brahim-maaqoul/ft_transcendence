import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import axios, { AxiosResponse } from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});
export async function middleware(request: NextRequest) {
  try {
    const jwtCookie = request.cookies.get('token')?.value;
    const isAuthorized = await checkAuthorization(jwtCookie);
    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/login', request.url).toString());
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url).toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*','/:id/Edit','/:user/profile'],
};

async function checkAuthorization(jwtCookie: string | undefined): Promise<boolean> {
  try {
    const apiUrl = 'http://localhost:8000/v1/api/auth/checkauth';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ token: jwtCookie }),
    });
    if (response.ok) {
      const result = await response.json();
      return result.isAuthenticated === true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}