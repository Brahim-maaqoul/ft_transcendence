"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API = axios.create({
  baseURL: "http://localhost:8000/v1/api/",
  withCredentials: true,
});

const TfaPage = () => {
  const [userInput, setUserInput] = useState("");

  const handleUserInput = (event: any) => {
    setUserInput(event.target.value);
  };

  const router = useRouter();

  const verifyTfaCode = async (e: any) => {
    try {
      const response = await API.get("/user/getUserInfo");

      if (response.data.userInfo) {
        const verifyResponse = await API.post("/user/verifyTfa", {
          code: userInput,
          UserInfo: response.data.userInfo,
        });

        if (verifyResponse.data) {
          e.preventDefault();
          router.push("/");
        } else {
          console.log("Verification failed");
        }
      } else {
        console.log("User information not available");
      }
    } catch (error) {
      console.log("Error getting user information:", error);
    }
  };

  return (
    <div className="z-0 w-full md:w-[500px] h-1/2 relative p-2 md:rounded-3xl bg-slate-500 bg-opacity-30  md:shadow-black md:shadow-2xl overflow-y-scroll no-scrollbar ">
      <div className="w-full overflow-auto h-full  md:bg-opacity-70 md:bg-slate-950   text-white  m-auto rounded-2xl p-10">
        <div className="flex flex-col items-center justify-center gap-10 h-full">
          <span>Provide the 6-digit code in your authenticator app</span>
          <input
            type="text"
            placeholder="Enter code"
            value={userInput}
            onChange={handleUserInput}
            className=" rounded-full text-center text-black"
          />
          <button onClick={verifyTfaCode}>Verify Code</button>
        </div>
      </div>
    </div>
  );
};

export default TfaPage;
