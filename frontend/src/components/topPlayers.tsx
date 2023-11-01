"use client";
import Link from "next/link";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";

interface Users {
  image: string;
  userName: string;
  score: number;
}

export default function TopPlayers() {
  const users: Users[] = [];
  for (let i = 0; i < 20; i++)
    users.push({
      image: "/nasr.png",
      userName: "Player",
      score: 12324,
    });

  return (
    <div className=" my-4 p-4  bg-slate-400 bg-opacity-20 rounded-2xl">
      <span className="text-white text-2xl font-mono px-4">Top Players</span>
      <div className="mt-2 ">
        <Splide
          options={{
            perPage: 9,
            arrows: false,
            pagination: false,
            drag: "free",
            autoWidth: true,
            gap: "1rem",
          }}>
          {users.map((user, index) => (
            <SplideSlide
              key={index}
              className="flex flex-col justify-center items-center p-4 m-4">
              <Link href={""} className="w-28">
                <Image
                  src={user.image}
                  alt={user.userName}
                  style={{ borderRadius: "50%" }}
                  className="h-28"
                  width={112}
                  height={112}
                />
              </Link>
              <span className="text-white text-lg">{user.userName}</span>
              <span className="text-slate-900 w-24">
                {user.score + " points"}
              </span>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
}
