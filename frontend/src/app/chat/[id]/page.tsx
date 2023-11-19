"use client"

import { Conversation } from "@/components/Conversation"
import { Groups } from "@/components/Groups"
import { Pepoule } from "@/components/Pepoule"
import NavBar from "@/components/navBar";
import { Search } from "@/components/search";


export default function Chat ({params})
{
    console.log(params.id)
    return (
    <div className="h-[767px]  z-0 w-full md:w-[83%]  relative md:p-2 md:rounded-3xl md:bg-slate-500 md:bg-opacity-40  md:shadow-black md:shadow-2xl overflow-y-scroll  no-scrollbar">
        <div className="flex h-full w-full ">
            <NavBar></NavBar>
            <div className=" h-[757px] w-full   md:p-2 " >
                <div className="  text-center ">
                <Search></Search>
                </div>
                <div className="   h-[90%]  grid grid-cols-5  grid-rows-5 ">
                <div className=" col-span-6 xl:col-span-3  row-span-5  bg-black bg-opacity-40 rounded-2xl shadow-black shadow-sm flex flex-col  p-2 m-2 ">
                    <Conversation id={params.id} ></Conversation>
                </div>
                <div className=" h-full  row-span-5  xl:grid xl:grid-rows-5  hidden col-span-2">
                    <div className=" row-span-2   bg-black bg-opacity-40 rounded-2xl shadow-black shadow-sm m-2 ">
                    <Groups></Groups>
                    </div>
                    <div className=" row-span-3   rounded-2xl bg-black bg-opacity-40 shadow-black shadow-sm  m-2  ">
                    <Pepoule></Pepoule>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    )
}