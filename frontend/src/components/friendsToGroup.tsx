import { addFriendToGroup } from "@/app/api/chatApi/chatApiFunctions";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { set } from "react-hook-form";

interface friendsToGroupProps {
  setFriendToGroup?: React.Dispatch<React.SetStateAction<boolean>>;
  friendToGroup?: boolean;
  groupName?: string;
  groupPassword?: string;
  groupPrivacy?: string;
  idGroup?: string;
  idUser?: string;
}


const iconToAdd = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="hover:cursor-pointer icon icon-tabler icon-tabler-user-plus text-gray-400 hover:text-white"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
    <path d="M16 19h6"></path>
    <path d="M19 16v6"></path>
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
  </svg>
);

const iconWhenAdd = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-user-check text-green-950"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
    <path d="M15 19l2 2l4 -4"></path>
  </svg>
);

const IconChange: React.FC <friendsToGroupProps> = ({idUser,idGroup}) => {
  const [friendJoin, setFriendJoin] = useState(true);
  const addFriendToGroupMutution = useMutation(addFriendToGroup);
  const handleAddFriendToGroup = (id: number) => {
    addFriendToGroupMutution.mutate({
      groupId: Number(idGroup),
      userId: idUser,
    });
    setFriendJoin(false);
  };

  return (
    <div
      className=" col-span-2 flex flex-row-reverse items-center w-[100%] pr-2 "
      onClick={() => handleAddFriendToGroup(1)}
    >
      {friendJoin ? iconToAdd : iconWhenAdd}
    </div>
  );
};
export const FriendsToGroup: React.FC<friendsToGroupProps> = ({
  friendToGroup,
  setFriendToGroup,
  idGroup,
}) => {
  const [friendAdded, setFriendAdded] = useState(null);

  const getAddFriendToGroupMutution = useMutation(addFriendToGroup);
  // const handleAddFriendToGroup = (id: number) => {
  //   getAddFriendToGroupMutution.mutate({
  //     groupId: Number(idGroup),
  //     userId2: id,
  //   });
  // };

  return (
    <div className=" w-full absolute overflow-auto bottom-11 top-20 ">
      <div className=" overflow-y-auto h-[100%] no-scrollbar">
        {FriendToGroup &&
          FriendToGroup.map((user: any, key: number) => {
            return (
              <div
                key={key}
                className={`grid grid-cols-6 p-2 w-fullborder-gray-300 hover:bg-black hover:bg-opacity-5 items-center `}
              >
                <div className=" flex  col-span-1 ">
                  <img
                    src={user.picture!}
                    alt="Profile picture"
                    width={52}
                    height={52}
                    className="rounded-full"
                  />
                </div>
                <div
                  id="info"
                  className="col-span-3 flex items-center text-lg font-mono tracking-normal"
                >
                  <span style={{ color: "white", marginRight: "10px" }}>
                    {user.name}
                  </span>
                  <span style={{ color: "black" }}>({user.username})</span>
                </div>
                <IconChange idUser={user.id} idGroup={idGroup} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

const FriendToGroup = [
  {
    name: "reda",
    id: "1",
    picture: "/reda.png",
    username: "lagala",
  },
  {
    name: "reda",
    id: "1",
    picture: "/reda.png",
    username: "lagala",
  },
  {
    name: "reda",
    id: "1",
    picture: "/reda.png",
    username: "lagala",
  },
  {
    name: "reda",
    id: "1",
    picture: "/reda.png",
    username: "lagala",
  },
  {
    name: "reda",
    id: "1",
    picture: "/reda.png",
    username: "lagala",
  },
  {
    name: "reda",
    id: "1",
    picture: "/reda.png",
    username: "lagala",
  },
  {
    name: "reda",
    id: "1",
    picture: "/reda.png",
    username: "lagala",
  },
  {
    name: "reda",
    id: "1",
    picture: "/reda.png",
    username: "lagala",
  },
  {
    name: "reda",
    id: "1",
    picture: "/reda.png",
    username: "lagala",
  },
  {
    name: "reda",
    id: "1",
    picture: "/reda.png",
    username: "lagala",
  },
];
