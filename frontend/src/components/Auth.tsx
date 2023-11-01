"use client"
import React from 'react'
import {useAuth} from "@/components/providers/AuthContext";
import {useCheckAuthentication} from '../app/api/checkAuthentication'
import { MouseEvent, useEffect, useState, useRef } from "react";


export const Auth = () => {
  const { isAuthenticated,dataUser, login, logout ,setuserdata,setuserdatanull} = useAuth();
  const { data, error, isLoading } = useCheckAuthentication();
  useEffect(() => {
    if (!isLoading) {
      if (data?.isAuthenticated) {
        login();
        setuserdata(data.user)
      } else {
        logout();
        setuserdatanull()
      }
    }
  }, [isLoading,data]);
    return (
    <div></div>
  )
}
