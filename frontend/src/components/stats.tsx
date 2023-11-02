import Image from "next/image";
import { UserProfile, useAuth } from "./providers/AuthContext";

function Stats({ profileData }: { profileData: UserProfile }) {
  const { dataUser } = useAuth();
  return (
    <div className="bg-black bg-opacity-40 rounded-2xl md:shadow-black shadow-2xl flex flex-col p-4 mx-2 my-3">
      <span className="text-white text-2xl font-mono">Stats</span>
      <div className="flex gap-x-6 my-4">
        <div className="flex flex-col items-center w-2/3">
          <div className="w-20 h-20 flex items-center">
            <div
              className="h-20 w-20 rounded-full bg-cover"
              style={{
                backgroundImage: `url(${profileData?.picture})`,
              }}></div>
          </div>
          <span className="text-white text-xl">{profileData?.nickname}</span>
        </div>
        <div className="flex flex-col items-center w-3/4">
          <div className="flex text-white text-lg xl:text-2xl font-bold gap-2">
            <span>L : 3</span>
            <span>|</span>
            <span>W : 30</span>
          </div>
          <div className="flex justify-center gap-x-12 text-white text-xs xl:text-xl ">
            <span>5</span>
            <span>Goal</span>
            <span>20</span>
          </div>
          <div className="flex justify-center gap-x-12 text-white text-xs xl:text-xl">
            <span>105</span>
            <span>Rank</span>
            <span>21</span>
          </div>
        </div>
        <div className="flex flex-col items-center w-2/3">
          <div className="w-20 h-20 flex items-center">
            <div
              className="h-20 w-20 rounded-full bg-cover"
              style={{
                backgroundImage: `url(${dataUser?.picture})`,
              }}></div>
          </div>
          <span className="text-white text-xl">{dataUser?.nickname}</span>
        </div>
      </div>
    </div>
  );
}

export default Stats;
