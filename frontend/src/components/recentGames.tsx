import Image from "next/image";
import { useAuth } from "./providers/AuthContext";
import { matchInterface, useGetMatchHistory } from "@/app/api/getGames";

export default function RecentGames({ nickname }: { nickname: string | null }) {
  const {
    data: MatchHistory,
    isLoading,
    isError,
  } = useGetMatchHistory(nickname);
  console.log("MatchHistory", MatchHistory);
  if (isLoading) return <>is loading ...</>;
  if (isError) return <>Error</>;
  return (
    <>
      <span className="text-white text-2xl font-mono m-4">Recent Games</span>
      {MatchHistory &&
        MatchHistory?.map((match: matchInterface, index: number) => (
          <div
            key={index}
            className="bg-black bg-opacity-40 rounded-2xl h-24 flex justify-between px-4 m-2"
          >
            <div className="flex gap-x-4 items-center">
              <div className="w-16 h-16 flex items-center">
                <div
                  className="h-16 w-16 rounded-full bg-cover"
                  style={{ backgroundImage: `url(${match.user1.picture})` }}
                ></div>
              </div>
              <span className="text-md lg:text-2xl text-slate-400">
                {match.user1.nickname}
              </span>
            </div>
            <span className="text-md lg:text-3xl text-slate-300 flex items-center">
              {match.score1} - {match.score2}
            </span>
            <div className="flex gap-x-4 items-center">
              <span className="text-md lg:text-2xl text-slate-400">
                {match.user2.nickname}
              </span>
              <div className="w-16 h-16 flex items-center">
                <div
                  className="h-16 w-16 rounded-full bg-cover"
                  style={{ backgroundImage: `url(${match.user2.picture})` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
