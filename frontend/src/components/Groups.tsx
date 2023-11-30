import Router from "next/navigation";
import React, { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  usegetGroups,
  creatGroup,
  useCheckIsGroupMember,
} from "@/app/api/chatApi/chatApiFunctions";
import { set } from "react-hook-form";
import Toggle from "./toggle";
import { stringify } from "querystring";
import { useMutation } from "@tanstack/react-query";
import { m } from "framer-motion";
import { CreatGroup } from "./creatGroup";
import { useAuth } from "@/components/providers/AuthContext";
import { JoinGroup } from "./joinGroup";
import { spinner } from "@/app/[user]/profile/page";
import { getTime } from "./messages";
interface Message {
  timestamp: string;
}

interface member{
  type: string
}

export interface Chat {
  id: number;
  name: string;
  picture: string;
  password: string;
  lastChange: string;
  Privacy: string;
  members: member[];
  messages: any[];

}

export const Groups = () => {
  const [newGroup, setNewGroup] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [joinId, setJoinId] = useState<Chat | null>(null);
  const [joinConfirm, setJoinConfirm] = useState(false);

  const { dataUser, showTrue } = useAuth();
  const { data:dataGroups, isError, isLoading } = usegetGroups();
  // const {data: groupId} = useCheckIsGroupMember({groupId: group.id})
  if (isError) return <div>error</div>;
  if (isLoading) return <div className="h-full flex justify-center items-center">{spinner}</div>;
  const route = useRouter();
  const pushId = (id: string) => {
    route.push(`/chat/${id}`);
  };
  const handleJoninGroup = (group: Chat) => {
    showTrue();
    if (!group.members.length || group.members[0].type === "notMember" || group.members[0].type === "banned") {
      setJoinId(group);
    } else {
      pushId(String(group.id));
    }

  };
  return (
    <div className="">
      <div className="flex">
        <h1 className="text-gray-300 ml-6 my-2 text-xl font-mono leading-normal">
          Groups
        </h1>
        <button
          onClick={() => setNewGroup(true)}
          className="ml-2 mt-0.5 cursor-pointer">
          <svg
            aria-label="New post"
            className="text-gray-300 hover:text-white x1lliihq x1n2onr6 x5n08af"
            fill="currentColor"
            height="19"
            role="img"
            viewBox="0 0 24 24"
            width="20">
            <title>New Group</title>
            <path
              d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"></path>
            <line
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              x1="6.545"
              x2="17.455"
              y1="12.001"
              y2="12.001"></line>
            <line
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              x1="12.003"
              x2="12.003"
              y1="6.545"
              y2="17.455"></line>
          </svg>
        </button>
      </div>
      <div className="overflow-y-auto h-[81.5%] no-scrollbar">
        {dataGroups.map((user: Chat, key: number) => {
          return (
            <div
              key={key}
              className={`grid grid-cols-6 p-2 w-full border-gray-300 hover:bg-black hover:bg-opacity-5 items-center ${
                isClicked ? "" : ""
              }`}
              onClick={() => handleJoninGroup(user)}
              style={{ cursor: "pointer" }}>
              <div className="flex col-span-1">
                <img
                  src={user.picture}
                  alt="Profile picture"
                  width={52}
                  height={52}
                  className="rounded-full"
                />
              </div>
              <div
                id="info"
                className="pt-1 col-span-3 text-xm font-mono tracking-normal text-white">
                {user.name}
                <p className="text-sm text-gray-400">{user.messages.length ? user.messages[0].message_text.length > 30 ? user.messages[0].message_text.slice(0,30)+'...' : user.messages[0].message_text : ""}</p>
                <p className="text-xs text-gray-300">{}</p>
              </div>
              <div className="col-span-2 flex flex-row-reverse items-center w-[100%] pr-2">
                <p className="text-gray-400 text-var-silver font-roboto text-xs font-light tracking-tighter">
                {getTime(new Date(user.lastChange))}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {newGroup && (
        <>
          <div className="absolute z-50 left-0 rounded-2xl opacity-100 right-0 top-0 bottom-0 m-auto backdrop-blur-sm"></div>
          <CreatGroup
            newGroup={newGroup}
            setNewGroup={setNewGroup}></CreatGroup>
        </>
      )}

      {joinId && !joinConfirm && (
        <>
          <div className="absolute z-50 left-0 rounded-2xl opacity-100 right-0 top-0 bottom-0 m-auto backdrop-blur-sm"></div>
          <JoinGroup
            joinId={joinId}
            setJoinId={setJoinId}
            joinConfirm={joinConfirm}
            setJoinConfirm={setJoinConfirm}></JoinGroup>
        </>
      )}
    </div>
  );
};
