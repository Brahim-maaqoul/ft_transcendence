import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { constants } from "buffer";

export interface UserProfileUpdate {
  nickname: string;
  displayname: string;
  picture: string;
}
interface GroupCreate {
  groupName: string;
  password: string;
  type: string;
}

interface messagesData {
  groupId: string;
}
export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

//

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
  });
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
// export function UsegetGroups(): UseQueryResult<any> {
//   return useQuery({ queryKey: ["dataGroups"], queryFn: getGroups });
// }

// async function getFriends() {
//   const response: AxiosResponse = await API.get("/chat/FriendsRome");
//   return response.data;
// }
// export function UsegetFriends(): UseQueryResult<any> {
//   return useQuery({ queryKey: ["dataFriend"], queryFn: getFriends });
// }

// export async function creatGroup(data: GroupCreate) {
//   const response: AxiosResponse = await API.post("/chat/createGroups", data);
//   return response.data;
// }

// export async function getMessages(data: messagesData) {
//   const response: AxiosResponse = await API.post("/chat/getAllMessage", data);
//   return response.data.allMessage;
// }
