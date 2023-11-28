import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageInfo } from "./Conversation";
import { sendMessages } from "@/app/api/chatApi/chatApiFunctions";

// interface messageProps {
//     id: string;
//     data: MessageInfo[];
//     setData: React.Dispatch<React.SetStateAction<MessageInfo[]>>;
//     dataUser: any;
//     socketchat: any;
// }

interface sendMessagesProps {
  id: string;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  dataUser: any;
  socketchat: any;
}

export const SendMessages: React.FC<sendMessagesProps> = ({
  id,
  message,
  setMessage,
  dataUser,
  socketchat,
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: sendMessages,
    onSuccess:() => {queryClient.invalidateQueries(['getMessages']);queryClient.invalidateQueries(['dataGroups']); queryClient.invalidateQueries(['getChat']);setMessage("");},
  })
  const handleSubmitNewMessage = () => {
    mutation.mutate({groupId: Number(id) , message: message});
  };

  return (
    <div className="w-full flex bottom-0 absolute ">
      <input
        value={message}
        onFocus={() => {
          socketchat?.emit("isTyping", { id: id });
        }}
        onBlur={() => {
          socketchat?.emit("leaveTyping", { id: id });
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
