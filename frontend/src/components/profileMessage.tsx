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
  group: any;
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
  // data: MessageInfo[];
  // setData: React.Dispatch<React.SetStateAction<MessageInfo[]>>;
  // dataUser: any;
}
export const ProfileMessages: React.FC<ProfileMessagesProps> = ({
  group,
  more,
  setMore,
}) => {
  const [isTyping, setisTyping] = useState<boolean>(false);
  const { dataUser, showFalse } = useAuth();

  return (
    <div className="w-full h-1/10 border-b border-gray-300 flex items-center p-1">
      <div className="flex">
          {
            group.type === "duo" ? <Link href={'/'+group.members[0].user.nickname+'/profile'}>
               <div className="w-12 h-12">
            <div
              className="h-12 w-12 rounded-full bg-cover"
              style={{ backgroundImage: `url(${ group.members[0].user.picture})` }}></div>
            </div>
            </Link>
            :
        <div className="w-12 h-12">
          <div
            className="h-12 w-12 rounded-full bg-cover"
            style={{ backgroundImage: `url(${ group.picture})` }}>
            </div>
        </div>
            }
      </div>
      <div id="info" className="ml-3">

          <span className="text-white text-lg">{group.type === "group" ? group.name: group.members[0].user.nickname}</span>
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
