import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { MessageInfo } from "./Conversation";

interface messageProps {
  id: string;
  data: MessageInfo[];
  setData: React.Dispatch<React.SetStateAction<MessageInfo[]>>;
  dataUser: any;
//   socketchat: any;
}

export const Messages: React.FC<messageProps> = ({
  id,
  data,
  setData,
  dataUser,
//   socketchat,
}) => {
  function getTime(dt: string) {
    const date = new Date(dt);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const datePart = dt.substring(0, dt.indexOf("T"));
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
        {/* <p className="text-white">Loading...</p> */}
        {data?.map((message, index) => (
          <div
            key={index}
            className={`my-2 max-w-[65%] ${
              message?.senderId === dataUser?.auth_id
                ? "ml-auto mr-0 "
                : "mr-auto ml-0 "
            }`}
          >
            <div className="flex">
              <p
                className={` text-white rounded-3xl p-2 px-3 shadow-black ${
                  message?.senderId === dataUser?.auth_id
                    ? " bg-[#45B9D5] ml-auto mr-0"
                    : "mr-auto ml-0 bg-gray-600"
                }`}
              >
                {message?.messageText}
              </p>
            </div>
            <div className="flex">
              <p
                className={` text-gray-900 text-xs px-2 ${
                  message?.senderId === dataUser?.auth_id
                    ? "  ml-auto mr-0"
                    : "mr-auto ml-0 "
                }`}
              >
                {getTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
