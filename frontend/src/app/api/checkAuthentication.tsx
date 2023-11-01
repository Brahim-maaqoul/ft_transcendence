import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { constants } from "buffer";

interface UserProfileUpdate {
  nickname: string;
  displayname: string;
  picture: string;
  bio: string;
}
interface GroupCreate {
  groupName: string;
  password: string;
  type: string;
}

interface messagesData {
  groupId: string;
}
const API = axios.create({
  baseURL: "http://localhost:8000/v1/api/",
  withCredentials: true,
});

//
async function getUserbyName(nickname: string) {
  try {
    const response: AxiosResponse = await API.get(
      "/user/profile?nickname=" + nickname
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function getUser(nickname: string) {
  return useQuery({
    queryKey: ["profileData", nickname],
    queryFn: () => getUserbyName(nickname),
  });
}

// checkAuthentication
async function checkAuthentication() {
  const response: AxiosResponse = await API.post("/auth/checkauth");
  return response.data;
}
// updateUserProfile
export async function updateUserProfile(data: UserProfileUpdate) {
  const response: AxiosResponse = await API.post("/auth/UpdateData", data);
  return response.data;
}

export function useCheckAuthentication(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["data"],
    queryFn: checkAuthentication,
    cacheTime: Infinity,
  });
}

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

async function getFriendType(auth_id: string) {
  try {
    const response: AxiosResponse = await API.get(
      "/friends/FriendStats?id=" + auth_id
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function useFriendType(auth_id: string) {
  return useQuery({
    queryKey: ["FriendshipType"],
    queryFn: () => getFriendType(auth_id),
  });
}
export async function addFriend(auth_id: string) {
  try {
    console.log("here");
    const response: AxiosResponse = await API.post("/friends/addFriend", {
      auth: auth_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

export async function acceptFriend(auth_id: string) {
  try {
    console.log("here");
    const response: AxiosResponse = await API.post("/friends/accepteFriend", {
      auth: auth_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

export async function unFriend(auth_id: string) {
  try {
    console.log("here");
    const response: AxiosResponse = await API.delete(
      "/friends/unFriend?auth=" + auth_id
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

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

export async function unblockFriend(auth_id: string) {
  try {
    console.log("here");
    const response: AxiosResponse = await API.post("/block/unblock", {
      auth: auth_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

async function getFriends(auth_id: string) {
  const response: AxiosResponse = await API.get("/friends/Friend?auth_id=" + auth_id);
  return response.data;
}

export function usegetFriends(auth_id:string): UseQueryResult<any> {
  return useQuery({ queryKey: ["Friends"], queryFn: () => getFriends(auth_id) });
}

// export function useAddFriend(auth_id: string) {
//   return useQuery(["AddFriend", auth_id], () => addFriend(auth_id));
// }

// async function postFriend();
// async function getUserChat() {
//   const response: AxiosResponse = await API.get('/users');
//   return response.data;
// }

// export function usegetUserChat(): UseQueryResult<any> {
//   return useQuery({ queryKey: ['dataUser'], queryFn: getUserChat});
// }

// async function getConversation() {
//   const response: AxiosResponse = await API.get('/CONVERSATION');
//   return response.data;
// }

// export function usegetConversation(): UseQueryResult<any> {
//   return useQuery({ queryKey: ['dataUser'], queryFn: getConversation});
// }

// Groups

// async function getGroups() {
//   const response: AxiosResponse = await API.get("/chat/Groups");
//   return response.data;
// }
// export function usegetGroups(): UseQueryResult<any> {
//   return useQuery({ queryKey: ["dataGroups"], queryFn: getGroups });
// }

// async function getFriends() {
//   const response: AxiosResponse = await API.get("/chat/FriendsRome");
//   return response.data;
// }
// export function usegetFriends(): UseQueryResult<any> {
//   return useQuery({ queryKey: ["dataFriend"], queryFn: getFriends });
// }

// export async function creatGroup(data: GroupCreate) {
//   const response: AxiosResponse = await API.post("/chat/createGroups", data);
//   console.log("responseeeeeeeee :", response.data.message);
//   return response.data;
// }

// export async function getMessages(data: messagesData) {
//   const response: AxiosResponse = await API.post("/chat/getAllMessage", data);
//   return response.data.allMessage;
// }
