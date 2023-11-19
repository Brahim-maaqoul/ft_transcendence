"use client";

import { Conversation } from "@/components/Conversation";
import { Groups } from "@/components/Groups";
import { Pepoule } from "@/components/Pepoule";
import NavBar from "@/components/navBar";
import { useAuth } from "@/components/providers/AuthContext";
import { Search } from "@/components/search";
import { useState } from "react";

export default function Chat({ params }: { params: any }) {
  console.log(params.id);
  const { show } = useAuth();
  let hidden: string;
  let hidden1: string;
  !show ? (hidden = "hidden") : (hidden = "");
  !show ? (hidden1 = "") : (hidden1 = "hidden");

  return (
    <div className="h-[767px]  z-0 w-full md:w-[83%]  relative md:p-2 md:rounded-3xl md:bg-slate-500 md:bg-opacity-40  md:shadow-black md:shadow-2xl overflow-y-scroll  no-scrollbar">
      <div className="flex h-full w-full ">
        <NavBar></NavBar>
        <div className=" h-[757px] w-full   md:p-2 ">
          <div className="  text-center ">
            <Search></Search>
          </div>
          <div className="   h-[90%] grid grid-cols-1 lg:grid-cols-2">
            <div
              className={`bg-black bg-opacity-40 rounded-2xl shadow-black shadow-sm ${hidden} lg:flex flex-col  p-2 m-2 `}>
              <Conversation id={params.id}></Conversation>
            </div>
            <div className={`h-full  w-full ${hidden1} lg:flex flex-col`}>
              <div className="h-[250px] bg-black bg-opacity-40 rounded-2xl shadow-black shadow-sm m-2 overflow-y-scroll no-scrollbar">
                <Groups></Groups>
              </div>
              <div className=" h-[400px] row-span-3   rounded-2xl bg-black bg-opacity-40 shadow-black shadow-sm  m-2  ">
                <Pepoule></Pepoule>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
