"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useEffect, useState, useRef } from "react";
import { TbPhotoEdit } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import {
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaDribbble,
} from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "../../styles.module.css";
import axios, { AxiosResponse } from "axios";
import { updateUserProfile } from "@/app/api/checkAuthentication";
import { useAuth } from "@/components/providers/AuthContext";
import { useRouter } from "next/navigation";

export default function Edit() {
  const { dataUser } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [displayname, setDisplayname] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [selectedFile, setSelectedFile] = useState<null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (dataUser) {
      setDisplayname(dataUser.nickname || "");
      setDisplayname(dataUser.displayname || "");
      setAvatar(dataUser.picture || "");
      setBio(dataUser.bio || "");
    }
  }, [dataUser]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["data"]);
    },
  });
  console.log(mutation);
  const { isSuccess, isLoading, isError } = mutation;
  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [mutation.isSuccess, router]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) setDisplayname(e.target.value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 50) setBio(e.target.value);
  };
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) setNickname(e.target.value);
  };

  const handleSubmit = () => {
    setDisplayname(displayname);
    setAvatar(avatar);
    setBio(bio);
    setNickname(nickname);
    mutation.mutate({
      displayname: displayname,
      picture: avatar,
      bio: bio,
      nickname: nickname,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  };

  if (!dataUser)
    return (
      <div className="flex justify-center items-center mt-10 ">
        <svg
          aria-hidden="true"
          className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#18181B]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );

  return (
    <div className="z-0 w-full md:w-[500px] h-[100vh] md:h-[700px] relative p-2 md:rounded-3xl bg-slate-500 bg-opacity-30  md:shadow-black md:shadow-2xl overflow-y-scroll no-scrollbar ">
      <div className=" w-full  overflow-auto h-full  md:bg-opacity-70 md:bg-slate-950   text-white  m-auto rounded-2xl p-10">
        <div className="relative">
          <div className="w-32 h-32 z-10 mx-auto">
            <div
              className="h-32 w-32 rounded-full bg-cover    "
              style={{ backgroundImage: `url(${dataUser?.picture!})` }}></div>
          </div>
          {/* <img width={120}   className='rounded-full   z-10 mx-auto   '  src={dataUser?.picture} alt="An image" crossOrigin="anonymous" />  */}
          <div className="absolute left-[56%] top-[85px]  bg-[#ffff]   text-[#000000] rounded-full p-1">
            <label for="image-upload" className="">
              <TbPhotoEdit className="  cursor-pointer" size={25}></TbPhotoEdit>
            </label>
            <input
              className="hidden"
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className=" py-5">
          {isError && mutation.error?.response?.data?.message && (
            <p>{mutation.error.response.data.message}</p>
          )}
          <div className=" p-2 flex flex-col my-2  rounded-lg   ">
            <div className="flex items-center justify-between">
              <label className="py-1">Displayname</label>
              <span className="text-[12px]">{displayname.length}/20</span>
            </div>
            <input
              type="text"
              value={displayname}
              onChange={handleUsernameChange}
              className="focus:outline-none p-2 bg-[#fff0] bg-none border "
            />
          </div>
          <div className=" p-2 flex flex-col  rounded-lg   ">
            <div className="flex items-center justify-between">
              <label className="py-1">Nickname</label>
              <span className="text-[12px]">{nickname.length}/20</span>
            </div>
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              className="focus:outline-none p-2 bg-[#fff0] border "
            />
          </div>
          <div className=" p-2 my-2 flex flex-col  rounded-lg   ">
            <div className="flex items-center justify-between">
              <label className="py-1">bio</label>
              <span className="text-[12px]">{bio.length}/50</span>
            </div>
            <textarea
              rows={2}
              className="focus:outline-none p-2 bg-[#fff0] text-[14px] border "
              value={bio}
              onChange={handleBioChange}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center mt-10 ">
            <svg
              aria-hidden="true"
              className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#18181B]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className={`${styles.notch_button} my-12 h-2 md:col-span-2 mx-auto md:h-4 w-[80%] md:w-[400px] mt-10  relative flex justify-center items-center`}>
            <div className="z-40 text-black md:text-lg lg:text-2xl font-mono absolute ">
              Save
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
