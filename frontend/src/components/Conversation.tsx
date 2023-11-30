import React, { useState, useEffect, useRef, use } from "react";
import Image from "next/image";
import styles from "../app/styles.module.css";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { get } from "http";
import { deleteGroup, useGetMessages } from "@/app/api/chatApi/chatApiFunctions";
import { AboutGroup } from "./aboutGroup";
import { FriendsToGroup } from "./friendsToGroup";
import { GroupManagement } from "./GroupManagement";
import { set } from "react-hook-form";
import { Messages } from "./messages";
import { SendMessages } from "./sendMessages";
import Profile from "@/app/[user]/profile/page";
import { ProfileMessages } from "./profileMessage";



export interface MessageInfo {
  sender_id: string;
  group_id: string;
  message_text: string;
  lastmodif: Date;
  sender: {
    nickname: string;
    picture: string;
  };

}
interface ConversationProps {
  id: string;
}

const selectMessage = (
  <div className="w-full h-full flex flex-col flex-wrap justify-center items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="currentColor"
      className="bi bi-chat text-white"
      viewBox="0 0 16 16">
      <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.720.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.520.263-1.639.742-3.468 1.105z" />
    </svg>
    <h1 className="text-white mt-2 text-xl font-mono leading-normal">
      Select a conversation
    </h1>
    <p className="text-gray-400 font-mono leading-">
      Send private messages to a friend or group.
    </p>
  </div>
);
export const Conversation: React.FC<ConversationProps> = ({ id }) => {
  if(isNaN(Number(id)))
    return <>{selectMessage}</>
  const [message, setMessage] = useState("");
  const [more, setMore] = useState(false);
  const { dataUser } = useAuth();
  // const [data, setData] = useState<MessageInfo[]>([]);
  const [friendToGroup, setFriendToGroup] = useState(false);

  // }, [mutation.isSuccess, mutation.isError, id]);
  const {data: getMessages, isSuccess, isError} = useGetMessages(id);
  console.log("more", more)
  return (
    <div className="relative h-full">
      {(isError) && <>Error</>}

      {isSuccess && (
        <div>
          <ProfileMessages group={getMessages} more={more} setMore={setMore} />
          {more && !friendToGroup && (
            <AboutGroup id={id} more={more} setMore={setMore}></AboutGroup>
          )}
          {more && (
            <>
              <GroupManagement
                idG={id}
                userId={dataUser?.auth_id}
                more={more}
                setMore={setMore}
                friendToGroup={friendToGroup}
                setFriendToGroup={setFriendToGroup}
              />
              {friendToGroup && (
                <FriendsToGroup
                  friendToGroup={friendToGroup}
                  setFriendToGroup={setFriendToGroup}
                  idGroup={id}
                  FriendToGroup={getMessages.members}
                  ></FriendsToGroup>
              )}
            </>
          )}
          {!more && isSuccess && (
            <>
              <Messages
                id={id}
                data={getMessages.messages}
                dataUser={dataUser}
              />
              <SendMessages
                id={id}
                message={message}
                setMessage={setMessage}
                dataUser={dataUser}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
