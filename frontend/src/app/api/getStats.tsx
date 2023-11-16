import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";
import { useQuery } from "@tanstack/react-query";

async function getStats(nickname: string) {
  try {
    const response: AxiosResponse = await API.get(
      "/user/Stats?nickname=" + nickname
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function useGetStats(nickname: string) {
  return useQuery(["Stats", nickname], () => getStats(nickname));
}
