import React, { useState } from 'react'
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usegetFriends } from '@/app/api/getFriends';
import { spinner } from '@/app/[user]/profile/page';
// import { usegetUserChat } from '@/app/api/checkAuthentication';
export const Pepoule = () => {

  const route = useRouter()
  const pushId = (id:string) => {
    route.push(`/chat/${id}`)
  }
  const [isClicked, setIsClicked] = useState(false);
  const { data, error, isLoading } = usegetFriends();
  if(error) return <div>error</div>
  if (isLoading) return <div className="h-full flex justify-center items-center">{spinner}</div>;
  return (
    <div  className="h-[100%] ">
      <div className="flex   ">
      <h1 className='text-gray-300 ml-6 my-2 text-xl font-mono leading-normal '>People</h1>
      </div>
      <div className=" overflow-y-auto h-[88%] no-scrollbar ">
      {data.map((user:any, key:any) => {
          return (
            <div key={key}
              className={`grid grid-cols-6 p-2 w-full  border-gray-300 hover:bg-black hover:bg-opacity-5 items-centere ${isClicked ? '' : ''}`}
              onClick={() => pushId(user.id)} style={{ cursor: 'pointer' }}
            >
                <div  className=" flex  col-span-1">
              <Image
                src="/reda.png"
                alt="Profile picture"
                width={54}
                height={54}
                className="rounded-full"
              />
            </div>
            <div  id="info" className="p-2  col-span-3 text-gray-300 ">
              {user.name}
              {/* <p className='text-xs text-gray-300'>{user.username}</p> */}
            </div>
            <div className=' col-span-2 flex flex-row-reverse   items-center w-[100%] pr-2'>
              <p className=' text-gray-400 text-var-selver font-roboto text-xs font-light tracking-tighter'>Today 9.12am</p>
              <p className= "bg-orange-700 px-1 text-sm  rounded-3xl  mr-2">12</p>
            </div>
          </div>
          )
      })}
  </div>
  </div>
  );
}

const userchat=[
  {
    id: "1",
    name: "lagala",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: true
  },
  {
    id: "2",
    name: "Reda",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: false
  },
  {
    id: "3",
    name: "Reda",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: true
  },
  {
    id: "1",
    name: "Re",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: true
  },
  {
    id: "2",
    name: "Reda",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: false
  },
  {
    id: "3",
    name: "Reda",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: true
  },
  {
    id: "1",
    name: "Re",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: true
  },
  {
    id: "2",
    name: "Reda",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: false
  },
  {
    id: "3",
    name: "Reda",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: true
  },
  {
    id: "1",
    name: "Re",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: true
  },
  {
    id: "2",
    name: "Reda",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: false
  },
  {
    id: "3",
    name: "Reda",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: true
  },
  {
    id: "1",
    name: "Re",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: true
  },
  {
    id: "2",
    name: "Reda",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: false
  },
  {
    id: "3",
    name: "Reda",
    image: "/reda.png",
    lastMessage: "Hello",
    lastMessageTime: "08:30",
    online: true
  },

];
