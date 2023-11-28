import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { MessageInfo } from "./Conversation";

interface messageProps {
  id: string;
  data: MessageInfo[];
  dataUser: any;
//   socketchat: any;
}

export const Messages: React.FC<messageProps> = ({
  id,
  data,
  dataUser,
//   socketchat,
}) => {
  function getTime(date: Date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;
    const toDate = new Date();
    const differenceInMilliseconds = toDate.getTime() - date.getTime();
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    return time;
  }
  return (
    <div className="w-full absolute overflow-auto bottom-11 top-16 no-scrollbar flex flex-col-reverse">
      <div>
        {data?.map((message, index) => (
          <div
            key={index}
            className={`my-2 max-w-[65%] ${
              message?.sender_id === dataUser?.auth_id
                ? "ml-auto mr-0 "
                : "mr-auto ml-0 "
            }`}
          >
            <div className="flex">
              <p
                className={` text-white rounded-3xl p-2 px-3 shadow-black ${
                  message?.sender_id === dataUser?.auth_id
                    ? " bg-[#45B9D5] ml-auto mr-0"
                    : "mr-auto ml-0 bg-gray-600"
                }`}
              >
                {message?.message_text}
              </p>
            </div>
            <div className="flex">
              <p
                className={` text-gray-900 text-xs px-2 ${
                  message?.sender_id === dataUser?.auth_id
                    ? "  ml-auto mr-0"
                    : "mr-auto ml-0 "
                }`}
              >
                {/* {getTime(message.lastmodif)} */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
