import { deleteGroup } from "@/app/api/chatApi/chatApiFunctions";
import { useMutation } from "@tanstack/react-query";

interface groupManagementProps {
  userId: string;
  idG: string;
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
  friendToGroup: boolean;
  setFriendToGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GroupManagement: React.FC<groupManagementProps> = ({
  userId,
  idG,
  more,
  setMore,
  friendToGroup,
  setFriendToGroup,
}) => {
  const handleExit = () => {
    setMore(false);
    setFriendToGroup(false);
  };

  const usedeleteGroup = useMutation(deleteGroup);
  const handleDeleteGroup = () => {
    usedeleteGroup.mutate({ groupId: Number(idG) });
    // setisDelete(true);
  };

  return (
    <div className="flex bottom-0 justify-between items-center absolute w-[100%]">
      <div className="flex">
        <button
          onClick={() => setFriendToGroup(true)}
          className="mr-auto ml-2 flex bottom-0  text-gray-300 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-users-plus"
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
            <path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
            <path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            <path d="M16 19h6"></path>
            <path d="M19 16v6"></path>
          </svg>
        </button>
      </div>
      <div className="flex w-[50%]">
        <button
          id="send"
          className="pl-2.5 bg-[#e13636f2] flex justify-center font-mono w-[100%] text-white rounded-3xl shadow-black mb-1 pr-2 py-1"
          onClick={handleDeleteGroup}
        >
          Delete
        </button>
      </div>
      <div className="flex bg-yello-600">
        <button
          onClick={handleExit}
          className="ml-auto mr-2 flex bottom-0 text-gray-300 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-arrow-big-right"
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
            <path d="M4 9h8v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1 -1.707 -.707v-3.586h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1z"></path>
            <title>Back</title>
          </svg>
        </button>
      </div>
    </div>
  );
};
