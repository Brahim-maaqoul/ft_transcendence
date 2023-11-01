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

export default function NavBar() {
  const [not, setNot] = useState(false);
  const { dataUser, isAuthenticated } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const handleDocumentClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setNot(false);
    }
  };

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
                  className="my-2">
                  <div className="w-12 h-12">
                    <div
                      className="h-12 w-12 rounded-full bg-cover"
                      style={{ backgroundImage: `url(${imageUrl})` }}></div>
                  </div>
                </Link>
              </div>
              <div className="my-2">
                <Link
                  href={"/"}
                  className="hover:bg-slate-400 w-12 h-12 rounded-full flex justify-center items-center">
                  <Image src="/home.svg" alt="home" width={32} height={32} />
                </Link>
              </div>
              <div className="my-2">
                <Link
                  href={"/chat/id"}
                  className="hover:bg-slate-400 w-12 h-12 rounded-full flex justify-center items-center">
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
                  className="hover:bg-slate-400 w-12 h-12 rounded-full flex justify-center items-center">
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
                  className="hover:bg-slate-400 w-12 h-12 text-[#fff] rounded-full flex justify-center items-center">
                  <IoNotificationsOutline size={32}></IoNotificationsOutline>
                </button>
              </div>
              <Link
                href={"http://localhost:8000/v1/api/auth/logout"}
                className="hover:bg-slate-400  w-12 my-2 mt-auto flex items-center justify-center  h-12 text-[#ffffff] rounded-full ">
                <FiLogOut size={32}></FiLogOut>
              </Link>
            </div>
          </div>

          {not && (
            <>
              <div className="absolute hidden lg:block top-0  left-0 bg-slate-950   lg:bg-opacity-50 backdrop-blur-sm   bottom-0  right-0  z-50"></div>
              <div
                ref={menuRef}
                className="absolute bg-white p-5  lg:w-[500px]    top-0  left-0  bottom-0   right-0 z-50">
                <div className="flex items-center justify-between">
                  <h1>Notification</h1>
                  <IoIosClose
                    onClick={() => {
                      setNot(false);
                    }}
                    className="lg:hidden"
                    size={32}></IoIosClose>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
