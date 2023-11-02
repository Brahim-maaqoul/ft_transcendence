import { spinner } from "@/app/[user]/profile/page";
import { usegetFriends } from "@/app/api/checkAuthentication";
import { UserProfile, useAuth } from "./providers/AuthContext";
import Link from "next/link";

export default function Friends({ auth_id }: { auth_id: string }) {
  const { data, isLoading, isError } = usegetFriends(auth_id);
  const { dataUser } = useAuth();

  if (isLoading) return <>{spinner}</>;

  if (isError || !data) return <>u have no friend like davies</>;

  return (
    <>
      {!isLoading &&
        data.map((element: UserProfile, index: number) => (
          <div key={index} className="flex justify-between px-4 mx-2 mt-6">
            <Link href={"/" + element?.nickname + "/profile"}>
              <div className="flex gap-x-4 items-center">
                <div className="w-16 h-16 flex items-center">
                  <div
                    className="h-16 w-16 rounded-full bg-cover"
                    style={{
                      backgroundImage: `url(${element.picture})`,
                    }}></div>
                </div>
                <span className="text-sm xl:text-2xl text-white">
                  {element?.displayname}
                </span>
              </div>
            </Link>
            {dataUser?.auth_id !== element?.auth_id && (
              <div className="flex gap-x-4 items-center">
                <div className="flex justify-around">
                  <button className="bg-black hover:bg-cyan-600 text-white p-2 ml-4 rounded-2xl   relative flex justify-center items-center px-5 text-xs md:text-sm xl:text-lg ">
                    Play Now
                  </button>
                  <button className="bg-black hover:bg-cyan-600 text-white p-2  ml-4 rounded-2xl   relative flex justify-center items-center px-5 text-xs md:text-sm xl:text-lg">
                    Message
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
    </>
  );
}
