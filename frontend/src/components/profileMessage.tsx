import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { MessageInfo } from "./Conversation";
import Image from "next/image";
import { close } from "./toggle";
import NextImage from "next/image";
import Link from "next/link";
import { usegetGroups } from "@/app/api/chatApi/chatApiFunctions";
import { group } from "console";
import { Chat } from "./Groups";
import { spinner } from "@/app/[user]/profile/page";

interface ProfileMessagesProps {
  id: string;
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
  // data: MessageInfo[];
  // setData: React.Dispatch<React.SetStateAction<MessageInfo[]>>;
  // dataUser: any;
  // socketchat: any;
}
// export const ProfileMessages: React.FC<ProfileMessagesProps> = ({ id ,dataUser , socketchat,isTyping,setisTyping, }) => {

export const ProfileMessages: React.FC<ProfileMessagesProps> = ({
  id,
  more,
  setMore,
}) => {
  const [isTyping, setisTyping] = useState<boolean>(false);
  const { dataUser, socketchat, showFalse } = useAuth();
  const { data:dataGroups, isError, isLoading } = usegetGroups();
  if (isError) return <div>error</div>;
  if (isLoading) return <div className="h-full flex justify-center items-center">{spinner}</div>;
  // useEffect(() => {
  //   socketchat?.on("isTyping", (newMessage: any) => {
  //     setisTyping(true);
  //   });
  //   return () => {
  //     socketchat?.off("isTyping");
  //   };
  // }, [socketchat]);
  // useEffect(() => {
  //   socketchat?.on("leaveTyping", (newMessage: any) => {
  //     setisTyping(false);
  //   });
  //   return () => {
  //     socketchat?.off("leaveTyping");
  //   };
  // }, [socketchat]);

  return (
    <div className="w-full h-1/10 border-b border-gray-300 flex items-center p-1">
      <div className="flex">
        <Image
          src="/reda.png"
          alt="Profile picture"
          width={54}
          height={54}
          className="rounded-full"
        />
      </div>
      <div id="info" className="ml-3">

          {dataGroups.map((user:Chat, key: number)=>{
            if (String(user.id) === id)
              return <span key={key}className="text-white text-lg">{user.name}</span>
          })}
       
        {!isTyping ? (
          <p className="text-xs font-mono ">online last 08:30</p>
        ) : (
          <p className="text-xs font-mono ">isTyping...</p>
        )}
      </div>
      <button className="ml-auto mr-0" onClick={() => setMore(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-300 hover:text-white icon icon-tabler icon-tabler-info-circle"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
          <path d="M12 9h.01"></path>
          <path d="M11 12h1v4h1"></path>
        </svg>
      </button>
      <button className="ml-4 flex lg:hidden" onClick={showFalse}>
        {close}
      </button>
    </div>
  );
};
