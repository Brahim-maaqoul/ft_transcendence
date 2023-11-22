"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { UserProfile, useAuth } from "./providers/AuthContext";
import { useFriendType } from "@/app/api/getFriendtype";
import { useGetStats } from "@/app/api/getStats";
import { getUser } from "@/app/api/getUserByNickname";

import FriendCases, { Block } from "./friendStatus";

function Infos({ profileData }: { profileData: UserProfile }) {
  const { dataUser } = useAuth();
  const { data: Stats } = useGetStats(profileData?.nickname);
  const { data: FriendshipType } = useFriendType(profileData.auth_id);
  const [show, setShow] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [logged, setlogged] = useState(true);
  const handleClickOutside = (event: MouseEvent<HTMLElement>) => {
    if (
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target as HTMLElement)
    ) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener(
      "click",
      handleClickOutside as unknown as (event: Event) => void
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside as unknown as (event: Event) => void
      );
    };
  }, []);
  const imageUrl = profileData?.picture;
  return (
    <div className="bg-black bg-opacity-40 rounded-3xl md:shadow-black shadow-2xl p-4 m-2 w-full">
      <div className="flex items-start flex-col md:flex-row  gap-8">
        <div className="w-48 h-48">
          <div
            className="h-48 w-48 rounded-full bg-cover relative"
            style={{ backgroundImage: `url(${imageUrl})` }}>
            {logged ? (
              <span className="absolute h-5 w-5 rounded-full bg-green-500 mt-40 ml-36 border-2 border-black"></span>
            ) : (
              <span className="absolute h-5 w-5 rounded-full bg-red-600 mt-40 ml-36 border-2 border-black"></span>
            )}
          </div>
        </div>
        <div className="w-full relative">
          <div className="flex items-start justify-between  pb-14  w-full  text-white text-xs/8  xl:text-xl gap-4">
            <div>
              <span className="flex justify-center text-xl md:text-3xl text-white">
                {profileData?.nickname}
              </span>
              <div className="text-white flex  items-center justify-start my-2">
                <span className="text-2xl">{Stats?.goal_scoared}</span>
                <span className="text-sm ml-2">Goals/Match</span>
              </div>
              <div className="text-white flex  items-center justify-start my-2">
                <span className="text-2xl">
                  {String((Stats?.wins || 0) + (Stats?.losses || 0))}
                </span>
                <span className="text-sm ml-2">Matches</span>
              </div>
            </div>
            {profileData?.nickname !== dataUser?.nickname && (
              <div className="flex items-start justify-end">
                {FriendshipType?.type !== "blocking" &&
                  FriendshipType?.type !== "blocked" && (
                    <div>
                      <button
                        onClick={() => {
                          setShow(!show);
                        }}
                        className="relative bg-white flex justify-center items-center w-16 rounded-3xl  "
                        ref={toggleButtonRef}>
                        <span className="h-2 w-2 mx-1 my-4 bg-black rounded-full  "></span>
                        <span className="h-2 w-2 mx-1 my-4 bg-black rounded-full "></span>
                        <span className="h-2 w-2 mx-1 my-4 bg-black rounded-full "></span>

                        {show && (
                          <div className="absolute z-50  right-0">
                            <motion.div
                              initial={{
                                y: 300,
                              }}
                              animate={{
                                y: 200,
                              }}
                              className="  flex flex-col  mb-44 p-5 w-44 gap-2  bg-black bg-opacity-80  text-md font-bold text-white rounded-2xl">
                              <Link
                                className="flex     items-center "
                                href={""}>
                                <Image
                                  src={"/challenge.png"}
                                  alt="Send Message"
                                  width={20}
                                  height={20}
                                  className="mr-3"
                                />
                                Challenge
                              </Link>
                              <Link className="flex  items-center " href={""}>
                                <Image
                                  src={"/Message.png"}
                                  alt="Send Message"
                                  width={20}
                                  height={20}
                                  className="mr-3"
                                />
                                Message
                              </Link>

                              <Block authId={profileData.auth_id} />
                            </motion.div>
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                {FriendshipType && (
                  <FriendCases
                    FriendshipType={FriendshipType.type}
                    authId={profileData.auth_id}
                  />
                )}
              </div>
            )}
          </div>
          <div className="w-full  absolute  left-0 right-0 bottom-0 z-0">
            <div className="flex flex-col items-center text-white mb-4">
              <span className="font-bold text-xl lg:text-3xl">
                Level {Math.floor(Stats?.points / 100 + 1)}
              </span>
              <span className="font-semibold text-xs lg:text-md">
                {100 - (Stats?.points % 100)} Points to next level
              </span>
            </div>
            <div className="relative">
              <Progress value={Stats?.points % 100} />
              <span className="absolute top-0 bottom-0 left-[45%] text-black text-lg md:text-2xl font-bold">
                {Stats?.points % 100}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Infos;
