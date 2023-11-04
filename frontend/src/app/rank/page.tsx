"use client"

import NavBar from "@/components/navBar";
import { useAuth } from "@/components/providers/AuthContext";
import Image from "next/image";
import RecentGames from "@/components/recentGames";

interface Users {
  image: string;
  userName: string;
  score: number;
}

function Rank() {
    const { dataUser } = useAuth();
    const users: Users[] = [];
    for (let i = 0; i < 20; i++)
        users.push({
        image: "/nasr.png",
        userName: "Player",
        score: 12324,
    });
    // if (!dataUser)
    //     return <></>
    return (
        
        <div className=" h-[1037px] flex items-center justify-center z-0 w-full md:w-[83%]  relative md:p-2 md:rounded-3xl md:bg-slate-500 md:bg-opacity-40  md:shadow-black md:shadow-2xl overflow-y-auto  no-scrollbar">
            <NavBar/>
            <div className="h-full w-full grid grid-cols-1 xl:grid-cols-2">
                <div className="flex flex-col">
                    <div className="h-[98px] bg-black bg-opacity-40 rounded-2xl  flex justify-between p-6 m-2">
                        <div className="flex gap-x-4 items-center">
                            <div className="w-16 h-16">
                                <div className="h-16 w-16 rounded-full bg-cover" style={{backgroundImage:`url(${dataUser?.picture!})`}}></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white text-2xl">YOUR RANK</span>
                                <span className="text-slate-400 font-medium text-sm">500 points</span>
                            </div>
                        </div>
                        <div className="flex  items-center">
                            <Image src={'/gold.svg'}
                                            alt="Avatar of user"
                                            width={100}
                                            height={100}
                                            className="w-32 h-32"
                                            
                                    />
                            <span className="text-white text-2xl"># 21</span>
                        </div>
                    </div>
                    <div className="bg-black h-[887px] bg-opacity-40 rounded-2xl  p-4 m-2 overflow-y-auto no-scrollbar">
                        <span className="text-white text-2xl font-mono">Global Rank</span>
                        <div className="flex justify-around">
                            <div className="mt-16 flex flex-col items-center relative">
                                <div className="absolute z-10 ml-16 flex justify-center items-center border-2   bg-gray-400 border-gray-500 w-6 h-6 rounded-full">2</div>
                                <div className="relative">
                                    <div className="w-24 h-24">
                                        <div className="h-24 w-24 rounded-full bg-cover border-8 border-gray-400" style={{backgroundImage:`url(${dataUser?.picture!})`}}></div>
                                    </div>
                                    <Image src={'/silver.svg'} width={100} height={100} alt="silver rank" className="absolute top-0 bottom-0 left-0 right-0 mt-16 ml-4 w-14 h-14" priority={true}/>
                                </div> 
                                <span className="text-gray-400 text-2xl mt-2">USERNAME</span>
                                <span className="text-gray-400 font-medium text-sm">443 points</span>
                            </div>
                            <div className="flex flex-col items-center relative">
                                <div className="absolute z-10 ml-16 flex justify-center items-center border-2   bg-amber-300 border-amber-400 w-6 h-6 rounded-full">1</div>
                                <div className="relative">
                                    <div className="w-24 h-24">
                                        <div className="h-24 w-24 rounded-full bg-cover border-8 border-amber-300" style={{backgroundImage:`url(${dataUser?.picture!})`}}></div>
                                    </div>
                                    <Image src={'/gold.svg'} width={100} height={100} alt="gold rank" className="absolute top-0 bottom-0 left-0 right-2 mt-12 ml-[-10px] w-24 h-24" priority={true}/>
                                </div> 
                                <span className="text-amber-300 text-2xl mt-2">USERNAME</span>
                                <span className="text-amber-300 font-medium text-sm">9443 points</span>
                            </div>
                            <div className="mt-16 flex flex-col items-center relative">
                                <div className="absolute z-10 ml-16 flex justify-center items-center border-2   bg-yellow-700 border-yellow-800 w-6 h-6 rounded-full">3</div>
                                <div className="relative">
                                    <div className="w-24 h-24">
                                        <div className="h-24 w-24 rounded-full bg-cover border-8 border-yellow-700" style={{backgroundImage:`url(${dataUser?.picture!})`}}></div>
                                    </div>
                                    <Image src={'/bronze.svg'} width={100} height={100} priority={true} alt="bronze rank" className="absolute top-0 bottom-0 left-0 h-14 w-14 right-0  mt-16 ml-4" />
                                </div> 
                                <span className="text-yellow-700 text-2xl mt-2">USERNAME</span>
                                <span className="text-yellow-700 font-medium text-sm">443 points</span>
                            </div>
                        </div>
                        {
                            users.map((user, index) => 
                                <div key={index} className="bg-black bg-opacity-40 rounded-2xl h-24 flex justify-between px-4 m-2">
                                    <div className="flex gap-x-4 items-center">
                                    <span className="text-5xl text-slate-400 ">#4</span>
                                        <div className="w-24 h-24 flex items-center">
                                            <div className="h-20 w-20 rounded-full bg-cover" style={{backgroundImage:`url(${dataUser?.picture!})`}}></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-400 text-2xl">YOUR RANK</span>
                                            <span className="text-slate-400 font-medium text-sm">500 points</span>
                                        </div>
                                    </div>
                                <div className="flex items-center">
                                    <Image src={'/gold.svg'}
                                            alt="Avatar of user"
                                            width={100}
                                            height={100}
                                            className="w-32 h-32"
                                            
                                    />
                                
                                </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="h-[1000px] bg-black bg-opacity-40 rounded-2xl py-6 m-2 overflow-y-auto no-scrollbar">
                    <RecentGames />
                </div>
            </div>
        </div>
    )
}

export default Rank;