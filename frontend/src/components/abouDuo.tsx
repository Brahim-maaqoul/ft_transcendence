import {
    usegetFriends,
    getMemberGroup,
    usegetGroups,
    banUserFromGroup,
    useGetMembers,
    useGetMemberShip,
  } from "@/app/api/chatApi/chatApiFunctions";
  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { use, useEffect, useRef, useState } from "react";
  import { set } from "react-hook-form";
  import { UserProfile, useAuth } from "./providers/AuthContext";
  import { AnyARecord } from "dns";
  import FriendCases, { Block, Unblock } from "./friendStatus";
  import { getUser } from "@/app/api/getUserByNickname";
  import { useFriendType } from "@/app/api/getFriendtype";
  import { blockFriend } from "@/app/api/blockFriend";
  import Image from "next/image";
  import { unblockFriend } from "@/app/api/unBlock";

interface ConversationProps {
    id: string;
    group: any;
}

export const AboutDuo: React.FC<ConversationProps> = ({ id, group}) => {
    const { data: FriendshipType } = useFriendType(group.members[0].user_id);
    console.log(FriendshipType)
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: blockFriend,
      onSuccess: () => {
        queryClient.invalidateQueries(["FriendshipType"]);
      },
    });
    const mutation1 = useMutation({
      mutationFn: unblockFriend,
      onSuccess: () => {
        queryClient.invalidateQueries(["FriendshipType"]);
      },
    });
    const handler = () => {
      mutation.mutate(group.members[0].user_id);
    };
    const handler1 = () => {
      mutation1.mutate(group.members[0].user_id);
    };
    if(FriendshipType?.type === 'blocked')
    {
        return <>your're blocked bitch</>
    }
    return (
      <div className=" w-full absolute overflow-auto bottom-11 top-20 ">
        <div className=" overflow-y-auto h-[100%] no-scrollbar">
            <div className="w-full">
              {
                FriendshipType?.type === 'blocking'?
                <div  onClick={handler1}
                className=" bg-slate-400 hover:bg-cyan-600 hover:cursor-pointer p-2   rounded-2xl   relative flex justify-center items-center px-5 text-xs lg:text-xl">
                <Image
                  src={"/unblock.png"}
                  alt="Unblock Friend"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Unblock
                  </div>
                  ://still a bug here
                  <div className="flex flex-col gap-y-2">
                  <div className=" bg-red-600 text-white p-2 rounded-2xl hover:cursor-pointer  relative flex justify-center items-center px-5 text-xs lg:text-xl" onClick={handler}>
                    <Image
                  src={"/block.png"}
                  alt="block Friend"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Block
              </div>
              <div className="bg-black text-white p-2 rounded-2xl hover:cursor-pointer  relative flex justify-center items-center px-5 text-xs lg:text-xl">
              <Image
                  src={"/challenge.png"}
                  alt="challenge Friend"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Play A Game
                </div>
              </div>
                }
            </div>
        </div>
      </div>
    );
};