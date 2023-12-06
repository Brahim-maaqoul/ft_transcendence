import Image from "next/image";
import { useAuth } from "./providers/AuthContext";

interface Users {
  image: string;
  userName: string;
  score: number;
}

const users: Users[] = [];
for (let i = 0; i < 20; i++)
  users.push({
    image: "/nasr.png",
    userName: "Player",
    score: 12324,
  });
export default function RecentGames() {
  const { dataUser } = useAuth();
  const picturePath = dataUser?.picture;
  return (
    <>
      <span className="text-white text-2xl font-mono m-4">Recent Games</span>
      {users.map((user, index) => (
        <div
          key={index}
          className="bg-black bg-opacity-40 rounded-2xl h-24 flex justify-between px-4 m-2"
        >
          <div className="flex gap-x-4 items-center">
            <div className="w-16 h-16 flex items-center">
              <div
                className="h-16 w-16 rounded-full bg-cover"
                style={{ backgroundImage: `url(${picturePath})` }}
              ></div>
            </div>
            <span className="text-2xl text-slate-400">Name</span>
          </div>
          <span className="text-3xl text-slate-300 flex items-center">
            7 - 5
          </span>
          <div className="flex gap-x-4 items-center">
            <span className="text-2xl text-slate-400">Name</span>
            <div className="w-16 h-16 flex items-center">
              <div
                className="h-16 w-16 rounded-full bg-cover"
                style={{ backgroundImage: `url(${picturePath})` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
