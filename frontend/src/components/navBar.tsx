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

interface notification
{
  type: string,
  seen: boolean,
  last_change: Date,
  Source:{
    auth_id: string,
    nickname: string,
    picture: string,
  }
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
  const {data: notifications, isSuccess} = useGetNotification()
  console.log("notification", notifications)
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
  return (
    <>
      {isAuthenticated && (
        <>
          <div className="z-50 fixed md:relative left-0 right-0 bottom-0  bg-black md:bg-none md:bg-opacity-10 md:rounded-full md:mx-5  md:mt-20 md:mb-auto">
            <div className=" m-2 flex  justify-between flex-row md:flex-col">
              <div>
                <Link
                  href={"/" + dataUser?.nickname + "/profile"}
                  className="my-2"
                >
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
                  href={"/" + dataUser?.displayname + "/rank"}
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

          {not  && ( notifications.map( (notification: notification, id:number) =>
            <>
              <div className="absolute hidden lg:block top-0  left-0 bg-slate-950   lg:bg-opacity-50 backdrop-blur-sm   bottom-0  right-0  z-50"></div>
              <div
                ref={menuRef}
                className="absolute bg-white p-5  lg:w-[500px]    top-0  left-0  bottom-0   right-0 z-50"
              >
                <div className="flex flex-col w-full overflow-y-auto no-scrollbar">
                  <span className="text-lg font-bold">Notifications</span>
                  <div className="flex flex-col w-full">
                    <div className="flex justify-evenly w-full p-4 hover:bg-slate-100 hover:rounded-2xl">
                      <Link
                        href={notification.Source.picture}
                        onClick={() => {
                          setNot(false);
                        }}
                        className="flex items-center  gap-x-4 w-full "
                      >
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
                      </Link>
                      <div className="flex items-center gap-x-3">
                        <button>
                          <div className="w-8 h-8">
                            <div
                              className="h-8 w-8 rounded-full bg-cover"
                              style={{
                                backgroundImage: `url(/reject.png)`,
                              }}
                            ></div>
                          </div>
                        </button>
                        <button>
                          <div className="w-7 h-7">
                            <div
                              className="h-7 w-7 rounded-full bg-cover"
                              style={{
                                backgroundImage: `url(/accept1.png)`,
                              }}
                            ></div>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div></div>
                    <div className="flex justify-evenly w-full p-4 hover:bg-slate-100 hover:rounded-2xl">
                      <Link
                        href={"/gyro/profile"}
                        onClick={() => {
                          setNot(false);
                        }}
                        className="flex items-center  gap-x-4 w-full "
                      >
                        <div className="w-14 h-14">
                          <div
                            className="h-14 w-14 rounded-full bg-cover"
                            style={{
                              backgroundImage: `url(/bmaaqoul.png)`,
                            }}
                          ></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-black-500 text-lg">
                            Brahim maaqoul
                          </span>
                          <span className="text-slate-500 text-sm">
                            You have a new message
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
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
          ))}
        </>
      )}
    </>
  );
}
