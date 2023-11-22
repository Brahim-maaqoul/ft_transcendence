import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";

export async function acceptFriend(auth_id: string) {
  try {
    const response: AxiosResponse = await API.post("/friends/accepteFriend", {
      auth: auth_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}
