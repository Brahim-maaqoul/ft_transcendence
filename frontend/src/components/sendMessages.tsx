import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageInfo } from "./Conversation";
import { sendMessages } from "@/app/api/chatApi/chatApiFunctions";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000/chat")
interface sendMessagesProps {
  id: string;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  dataUser: any;
}

export const SendMessages: React.FC<sendMessagesProps> = ({
  id,
  message,
  setMessage,
  dataUser,
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: sendMessages,
    onSuccess:() => {
      setMessage("");
      socket.emit("sendMessage", {group_id: id})
    },
  })
  const handleSubmitNewMessage = () => {
    mutation.mutate({groupId: Number(id) , message: message});
  };
  
  return (
    <div className="w-full flex bottom-0 absolute ">
      <input
        value={message}
        onFocus={() => {
        }}
        onBlur={() => {
        }}
        onChange={(input) => setMessage(input.target.value)}
        id="msg"
        placeholder="Type your message here..."
        className="border bg-gray-600 text-white rounded-3xl w-[85%] pl-4 shadow-black"
        type="text"
        required
        autoComplete="off"
        onKeyPress={(e) => {
          if (e.key === "Enter" && message.trim() !== "") {
            handleSubmitNewMessage();
          }
        }}
      />
      <label htmlFor="msg"></label>
      <button
        id="send"
        className={`pl-2.5 bg-[#45B9D1] text-white rounded-3xl shadow-black pr-2 py-1.5 ml-3 ${
          !message && "cursor-not-allowed"
        }`}
        onClick={(e) => {
          if (message.trim() !== "") {
            handleSubmitNewMessage();
          }
        }}
      >
        Send
      </button>
    </div>
  );
};
