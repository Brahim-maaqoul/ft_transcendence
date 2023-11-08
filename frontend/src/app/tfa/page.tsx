"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API = axios.create({
  baseURL: "http://localhost:8000/v1/api/",
  withCredentials: true,
});

const TfaPage = () => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [UserInfo, setUserInfo] = useState(null);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    API.get("/user/getQrCode").then((response) => {
      setQrCodeData(response.data.qrcode);
      setUserInfo(response.data.userInfo);
    });
  }, []);

  const handleUserInput = (event: any) => {
    setUserInput(event.target.value);
  };

  const router = useRouter();

  const verifyTfaCode = async (e: any) => {
    await API.post("/user/verifyTfa", { code: userInput, UserInfo })
      .then((response) => {
        if (response.data) {
          e.preventDefault();
          router.push("/");
        }
      })
      .catch((error) => {
        console.log("err : ", error);
      });
  };

  return (
    <div className="z-0 w-full md:w-[500px] h-[100vh] md:h-[700px] relative p-2 md:rounded-3xl bg-slate-500 bg-opacity-30  md:shadow-black md:shadow-2xl overflow-y-scroll no-scrollbar ">
      <div className=" w-full  overflow-auto h-full  md:bg-opacity-70 md:bg-slate-950   text-white  m-auto rounded-2xl p-10">
        <div className="flex flex-col items-center justify-center gap-10 h-full">
          {qrCodeData && qrCodeData.qrcode ? (
            <Image
              src={qrCodeData.qrcode}
              alt="QR Code"
              width={200}
              height={200}
            />
          ) : null}
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
