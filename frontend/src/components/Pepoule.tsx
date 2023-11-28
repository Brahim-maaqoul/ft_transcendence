import React, { useState } from 'react'
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetChat, usegetFriends } from '@/app/api/getFriends';
import { spinner } from '@/app/[user]/profile/page';

interface duo
{
  id: number;
  members: Array<any>
  messages: Array<any>

}

// import { usegetUserChat } from '@/app/api/checkAuthentication';
export const Pepoule = () => {

  const route = useRouter()
  const pushId = (id:number) => {
    route.push(`/chat/` + id)
  }
  const [isClicked, setIsClicked] = useState(false);
  const { data, isError, isLoading } = useGetChat();
  if(isError) return <div>error</div>
  if (isLoading) return <div className="h-full flex justify-center items-center">{spinner}</div>;
  console.log(data)
  // return <></>
  return (
    <div  className="h-[100%] ">
      <div className="flex   ">
      <h1 className='text-gray-300 ml-6 my-2 text-xl font-mono leading-normal '>People</h1>
      </div>
      <div className=" overflow-y-auto h-[88%] no-scrollbar ">
      {data.map((group:duo, key:number) => {
          return (
            <div key={key}
              className={`grid grid-cols-6 p-2 w-full  border-gray-300 hover:bg-black hover:bg-opacity-5 items-centere ${isClicked ? '' : ''}`}
              onClick={() => pushId(group.id)} style={{ cursor: 'pointer' }}
            >
                <div  className=" flex  col-span-1">
              {/* <ImageusegetFriends
                src="/reda.png"
                alt="Profile picture"
                width={54}
                height={54}
                className="rounded-full"
              /> */}
              <div className="w-12 h-12">
                    <div
                      className="h-12 w-12 rounded-full bg-cover"
                      style={{ backgroundImage: `url(${group.members[0].user.picture})` }}></div>
                  </div>
            </div>
            <div  id="info" className="p-2  col-span-3 text-gray-300 ">
              {group.members[0].user.nickname}
              {/* <p className='text-xs text-gray-300'>{user.username}</p> */}
            </div>
            <div> {group.messages.length ? group.messages[0].message_text : ""} </div>
            <div className=' col-span-2 flex flex-row-reverse   items-center w-[100%] pr-2'>
              <p className=' text-gray-400 text-var-selver font-roboto text-xs font-light tracking-tighter'>Today 9.12am</p>
              {/* <p className= "bg-orange-700 px-1 text-sm  rounded-3xl  mr-2">12</p> */}
            </div>
          </div>
          )
      })}
  </div>
  </div>
  );
}


