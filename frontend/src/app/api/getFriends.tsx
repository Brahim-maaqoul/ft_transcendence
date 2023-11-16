import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

async function getFriends(auth_id: string) {
  const response: AxiosResponse = await API.get(
    "/friends/Friend?auth_id=" + auth_id
  );
  return response.data;
}

export function usegetFriends(auth_id: string): UseQueryResult<any> {
  return useQuery({
    queryKey: ["Friends"],
    queryFn: () => getFriends(auth_id),
  });
}
