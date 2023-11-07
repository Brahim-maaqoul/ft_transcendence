import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";

export async function blockFriend(auth_id: string) {
  try {
    console.log("here");
    const response: AxiosResponse = await API.post("/block/blockUser", {
      auth: auth_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}
