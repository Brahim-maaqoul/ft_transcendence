"use client";
import React from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { useCheckAuthentication } from "../app/api/checkAuthentication";
import { MouseEvent, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function Auth() {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname === "/login") return <></>
  return <CheckAuth/>
}

export function CheckAuth()
{
  const {
    isAuthenticated,
    dataUser,
    login,
    logout,
    setuserdata,
    setuserdatanull,
  } = useAuth();
  const router = useRouter();
  const { data, isLoading, isError, error} = useCheckAuthentication();
  useEffect(() => {
    console.log(data?.isAuthenticated, isLoading , isError, error);
    if (!isLoading || isError) {
      console.log("isAuthenticated");
      if (data?.isAuthenticated) {
        login();
        setuserdata(data.user);
      } else {
        logout();
        setuserdatanull();
        console.log("here")
        router.push("/login");
      }
    }
  }, [isLoading, data, isError, error]);
  return <div></div>;
}
