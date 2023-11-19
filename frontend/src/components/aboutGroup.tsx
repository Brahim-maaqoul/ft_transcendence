import {
  usegetFriends,
  getMemberGroup,
  usegetGroups,
  banUserFromGroup,
} from "@/app/api/chatApi/chatApiFunctions";
import { useMutation } from "@tanstack/react-query";
import { use, useEffect, useRef, useState } from "react";
import { set } from "react-hook-form";
import { UserProfile } from "./providers/AuthContext";
import { AnyARecord } from "dns";

interface moreProps {
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
}


interface groupUsersProps {
  userId: string;
  idG: string;
  // u can add more props here
}

interface members {
  auth_id: number;
  displayname: string;
  nickname: string;
  picture: string;
}
interface ConversationProps {
  id: string;
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
}

const iconAdd = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="white"
    fill="white"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.267 0 .529 .026 .781 .076"></path>
    <path d="M19 16l-2 3h4l-2 3"></path>
    <title>make admin</title>
  </svg>
);

const iconRemove = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="red"
    fill="red"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
    <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5"></path>
    <path d="M22 22l-5 -5"></path>
    <path d="M17 22l5 -5"></path>
    <title>remove from group</title>
  </svg>
);

const iconMute = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
    <path d="M5.7 5.7l12.6 12.6"></path>
    <title>Mute</title>
  </svg>
);



const GroupUserManagement: React.FC <groupUsersProps> = ({ userId, idG }) => {
  // handleBanYser **************

  const banUser = useMutation(banUserFromGroup);
  const handleBanUserFromGroup = (userId: string) => {
    banUser.mutate({userId2: userId, groupId: Number(idG)});
  };

  // handleAddUser **************

  const handleAddUserToGroup = (userId: string) => {
    banUser.mutate({userId2: userId, groupId: Number(idG)});
  };

  // handleMuteUser **************
  
  const handlekickUserFromGroup = (userId: string) => {
    banUser.mutate({userId2: userId, groupId: Number(idG)});
  };

  // *********** FIN ******************

  return (
    <div className=" col-span-2 flex flex-row-reverse   items-center w-[100%] pr-2 ">
      <button  className="hover:cursor-pointer icon icon-tabler icon-tabler-user-bolt">
        {iconAdd}
      </button>
      <button className="hover:cursor-pointer icon icon-tabler icon-tabler-user-x m-2" onClick={() => handleBanUserFromGroup(userId)}>
        {iconRemove}
      </button>
      <button className="hover:cursor-pointer icon icon-tabler icon-tabler-ban ">
        {iconMute}
      </button>
    </div>
  );
};

export const AboutGroup: React.FC<ConversationProps> = ({ id, more, setMore }) => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const [add, setAdd] = useState(false);
  const [block, setBlock] = useState(false);
  const [deleteFriend, setDeleteFriend] = useState(false);
  const [data, setData] = useState<UserProfile[]>([]);
  const [ids, setId] = useState(0);

  const getMembersGroup = useMutation(getMemberGroup);
  useEffect(() => {
    getMembersGroup.mutate({ groupId: Number(id) });
  }, []);

  useEffect(() => {
    setId(Number(id));

    if (getMembersGroup.isSuccess) setData(getMembersGroup.data);
  }, [getMembersGroup.isSuccess, getMembersGroup.isError, id]);

  return (
    <div className=" w-full absolute overflow-auto bottom-11 top-20 ">
      <div className=" overflow-y-auto h-[100%] no-scrollbar">
        {getMembersGroup.data &&
          getMembersGroup.data.map((user: UserProfile, key: number) => {
            return (
              <div
                key={key}
                className={`grid grid-cols-6 p-2 w-full  border-gray-300 hover:bg-black hover:bg-opacity-5   items-center `}
              >
                <div className=" flex  col-span-1 ">
                  <img
                    src={user.user?.picture!}
                    alt="Profile picture"
                    width={52}
                    height={52}
                    className="rounded-full"
                  />
                </div>
                <div
                  id="info"
                  className="pt-1 col-span-3 flex items-center text-white text-lg font-mono tracking-normal"
                >
                  {user.user?.displayname}
                </div>
                <GroupUserManagement userId={user.user?.id} idG = {id}/>
              </div>
            );
          })}
      </div>
    </div>
  );
};
