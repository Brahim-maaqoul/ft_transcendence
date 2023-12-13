import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";
import { useQuery } from "@tanstack/react-query";

export interface rankInterface {
  leaderboard: string;
  user: {
    nickname: string;
    picture: string;
    auth_is: string;
  };
}

async function getRank() {
  const response: AxiosResponse = await API.get("/user/Rank");
  return response.data;
}

export function useGetRank() {
  return useQuery({
    queryKey: ["Rank"],
    queryFn: () => getRank(),
  });
}

async function getMyRank() {
  const response: AxiosResponse = await API.get("/user/myRank");
  return response.data;
}

export function useGetMyRank() {
  return useQuery({
    queryKey: ["myRank"],
    queryFn: () => getMyRank(),
  });
}
