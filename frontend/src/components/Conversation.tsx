import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import io from 'socket.io-client';
import { useAuth } from '@/components/providers/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { get } from 'http';
import { getMessages } from '@/app/api/checkAuthentication';

interface MessageInfo {
  senderId: String,
  groupId: string,
  messageText: string,
  timestamp: any
}
interface ConversationProps {
  id: string,
  
}



export const Conversation : React.FC<ConversationProps> = ({ id }) => {
  const [message, setMessage] = useState('');
  const { dataUser } = useAuth();
  const [data, setData] = useState<MessageInfo[]>([]);
  const socket = io('http://localhost:8000');

  useEffect(() => {
    socket.on('sendMessage', (newMessage:MessageInfo) => {
      console.log("message",newMessage)
      setData((prevMessages) => [...prevMessages, newMessage]);

    });
    return () => {
      socket.off('sendMessage'); 
    };
  }, []);

  const handleSubmitNewMessage = () => {
    socket.emit('sendMessage', { senderId: dataUser?.auth_id,
      groupId: id, 
      messageText: message,});
    setMessage('');
  };

  function getTime(dt : string)  {
    
    const date = new Date(dt);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const datePart = dt.substring(0, dt.indexOf('T'));
    const time = `${(hours)}:${minutes}`;
    const toDate = new Date();
    const differenceInMilliseconds = toDate.getTime() - date.getTime();
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    return time;
  }


  const mutation = useMutation(getMessages);
  const handegetAllmessage = () =>
  {
      mutation.mutate({groupId:id});
  }
  useEffect(() => {
    handegetAllmessage();
  },[])

  useEffect(() => {
    
   if (mutation.isSuccess) 
    {
      setData(mutation.data);
    }
    }, [mutation.isSuccess, mutation.isError,id]);

  const scrollBarStyle = {
    padding: '0 1rem',
    boxSizing: 'border-box',
    overflowY: 'scroll',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column-reverse',
    scrollbarWidth: 'none',
  };

  return (
    <div className="relative h-[100%]">
      {(id === 'id'  || mutation.isError)  && (
        <div className="w-full h-full flex flex-col flex-wrap justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="currentColor"
            className="bi bi-chat text-white"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.720.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"
            />
          </svg>
          <h1 className=" text-white mt-2 text-xl font-mono leading-normal">Select a conversation</h1>
          <p className="text-gray-400  font-mono leading-">
            Send private photos and messages to a friend or group.
          </p>
        </div>
      )}

      {id !== 'id' &&  mutation.isSuccess && (
        <div>
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
              <Link href="/path" className="hover:cursor-pointer text-xm font-mono text-white">
                {id}
              </Link>
              <p className="text-xs font-mono ">online last 08:30</p>
            </div>
          </div>
          <div style={scrollBarStyle} className="w-full absolute overflow-auto bottom-11 top-16 no-scrollbar ">
            <div >
              { mutation.isLoading && <p className="text-white">Loading...</p>}
              {data?.map((message, index) => (
                <div key={index}className={`my-2 max-w-[65%] ${
                  message?.senderId === dataUser?.auth_id ? 'ml-auto mr-0 ' : 'mr-auto ml-0 '
                }`}>
                  <div className="flex">
                  <p className={` text-white rounded-3xl p-2 px-3 shadow-black ${
                      message?.senderId === dataUser?.auth_id ? ' bg-[#45B9D5] ml-auto mr-0' : 'mr-auto ml-0 bg-gray-600'
                    }`}>
                    {message?.messageText}
                    </p>
                  </div>
                  <div className="flex">
                    <p className={` text-gray-900 text-xs px-2 ${
                      message?.senderId === dataUser?.auth_id ? '  ml-auto mr-0' : 'mr-auto ml-0 '
                    }`}>{getTime(message.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex bottom-0 absolute">
            <input
              value={message}
              onChange={(input) => setMessage(input.target.value)}
              id="msg"
              placeholder="Type your message here..."
              className="border bg-gray-600 text-white rounded-3xl w-[85%] pl-4 shadow-black bsolute"
              type="text"
              required
              autoComplete="off"
            />
            <label htmlFor="msg"></label>
            <button
              id="send"
              onClick={handleSubmitNewMessage}
              className="pl-2.5 bg-[#45B9D5] text-white rounded-3xl shadow-black pr-2 py-1.5 ml-1"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};