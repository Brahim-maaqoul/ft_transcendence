import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { MessageInfo } from "./Conversation";

interface messageProps {
  id: string;
  data: MessageInfo[];
  dataUser: any;
}

export const Messages: React.FC<messageProps> = ({
  id,
  data,
  dataUser,
}) => {
  function getTime(date: Date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;
    return time;
  }

  return (
    <div className="w-full absolute overflow-y-scroll bottom-11 top-16 no-scrollbar flex flex-col-reverse">
      <div>
        {data?.map((message, index) => (
          <div
            key={index}
            className={`my-2   ${
              message?.sender_id === dataUser?.auth_id
                ? "ml-auto mr-0 "
                : "mr-auto ml-0 "
            }`}
          >
            <div className="flex">
              <div
                className={` break-words  max-w-xs text-white  rounded-3xl mr-3 py-2 px-4 shadow-black ${
                  message?.sender_id === dataUser?.auth_id
                    ? "bg-[#45B9D5] ml-auto mr-0"
                    : "mr-auto ml-0 bg-gray-600"
                }`}
              >
                  {message?.message_text}
              </div>
            </div>
            <div className="flex">
              <p
                className={`text-gray-900 text-xs px-2 ${
                  message?.sender_id === dataUser?.auth_id
                    ? "ml-auto mr-0"
                    : "mr-auto ml-0 "
                }`}
              >
                {getTime(new Date(message.lastmodif))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
