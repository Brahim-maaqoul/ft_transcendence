"use client";
import Link from "next/link";
import Image from "next/image";
import { BiHomeAlt2, BiChat } from "react-icons/bi";
import { BsChatLeftDots } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { useScroll } from "framer-motion";
import { MouseEvent, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthContext";
import { useCheckAuthentication } from "@/app/api/checkAuthentication";
import { useGetNotification } from "@/app/api/notification";

interface notification {
  type: string;
  seen: boolean;
  last_change: Date;
  path: string;
  Source: {
    auth_id: string;
    nickname: string;
    picture: string;
  };
}

export default function NavBar() {
  const [not, setNot] = useState(false);
  const { dataUser, isAuthenticated } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const handleDocumentClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setNot(false);
    }
  };
  const { data: notifications, isSuccess } = useGetNotification();
  console.log("notification", notifications);
  useEffect(() => {
    if (not) {
      document.addEventListener(
        "click",
        handleDocumentClick as unknown as (event: Event) => void
      );
    } else {
      document.removeEventListener(
        "click",
        handleDocumentClick as unknown as (event: Event) => void
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleDocumentClick as unknown as (event: Event) => void
      );
    };
  }, [not]);
  const imageUrl = dataUser?.picture;
  console.log(dataUser?.nickname, "check")
  if (!dataUser)
    <></>
  const accept = () => {
    console.log("accept");
  };
  const reject = () => {
    console.log("reject");
  };
  return (
    <>
      {isAuthenticated && (
        <>
          <div className="z-50 fixed md:relative left-0 right-0 bottom-0  bg-black md:bg-none md:bg-opacity-10 md:rounded-full md:mx-5  md:mt-20 md:mb-auto">
            <div className=" m-2 flex  justify-between flex-row md:flex-col">
              <div>
                <Link href={"/profile/" + dataUser?.nickname} className="my-2">
                  <div className="w-12 h-12">
                    <div
                      className="h-12 w-12 rounded-full bg-cover"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    ></div>
                  </div>
                </Link>
              </div>
              <div className="my-2">
                <Link
                  href={"/"}
                  className="hover:bg-slate-400 w-12 h-12 rounded-full flex justify-center items-center"
                >
                  <Image src="/home.svg" alt="home" width={32} height={32} />
                </Link>
              </div>
              <div className="my-2">
                <Link
                  href={"/chat/id"}
                  className="hover:bg-slate-400 w-12 h-12 rounded-full flex justify-center items-center"
                >
                  <Image
                    src="/add.svg"
                    alt="add friends"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>

              <div className="my-2">
                <Link
                  href={"/Rank"}
                  className="hover:bg-slate-400 w-12 h-12 rounded-full flex justify-center items-center"
                >
                  <Image
                    src="/friends.svg"
                    alt="online friends"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>
              <div className="my-2">
                <button
                  onClick={() => {
                    setNot(true);
                  }}
                  className="hover:bg-slate-400 w-12 h-12 text-[#fff] rounded-full flex justify-center items-center"
                >
                  <IoNotificationsOutline size={32}></IoNotificationsOutline>
                </button>
              </div>
              <Link
                href={"http://localhost:8000/v1/api/auth/logout"}
                className="hover:bg-slate-400  w-12 my-2 mt-auto flex items-center justify-center  h-12 text-[#ffffff] rounded-full "
              >
                <FiLogOut size={32}></FiLogOut>
              </Link>
            </div>
          </div>

          {not && (
            <>
              <div className="absolute lg:block bottom-0  right-0 top-0 left-0 bg-slate-950   lg:bg-opacity-50 backdrop-blur-sm h-full z-50"></div>
              <div
                ref={menuRef}
                className="absolute bg-white p-5  lg:w-[500px]    top-0  left-0  bottom-0   right-0 z-50"
              >
                <div className="flex h-full flex-col w-full overflow-y-auto no-scrollbar">
                  <span className="text-lg font-bold">Notifications</span>
                  {notifications.map(
                    (notification: notification, id: number) => (
                      <div key={id} className="flex flex-col w-full">
                        <Link
                          href={`/profile/${notification.Source.nickname}`}
                          onClick={() => {
                            setNot(false);
                          }}
                          className={`flex items-center  gap-x-4 w-full p-4 mt-6 rounded-2xl justify-between ${
                            !notification.seen && "bg-slate-600"
                          }`}
                        >
                          <div className="flex gap-4">
                            <div className="w-14 h-14">
                              <div
                                className="h-14 w-14 rounded-full bg-cover"
                                style={{
                                  backgroundImage: `url(${notification.Source.picture})`,
                                }}
                              ></div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-black-500 text-lg">
                                {notification.Source.nickname}
                              </span>
                              <span className="text-slate-500 text-sm">
                                {notification.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-4 justify-center">
                            <button onClick={accept}>
                              <svg
                                className="w-6 h-6 hover:text-blue-600"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                            </button>
                            <button onClick={reject}>
                              <svg
                                className="w-6 h-6 hover:text-red-600"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                            </button>
                          </div>
                        </Link>
                      </div>
                    )
                  )}
                  <IoIosClose
                    onClick={() => {
                      setNot(false);
                    }}
                    className="lg:hidden"
                    size={32}
                  ></IoIosClose>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
