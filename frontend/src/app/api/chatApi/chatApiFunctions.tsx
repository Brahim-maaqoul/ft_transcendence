import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { API } from "../checkAuthentication";

interface GroupCreate {
  groupName: string;
  password: string;
  type: string;
}
interface Message {
  timestamp: string;
}

interface Chat {
  groupId: number;
  type: string;
  password: string;
}

interface messagesData {
  groupId: string;
}

interface idGroup {
  groupId: number;
  userId?: string;
}

interface banUser {
  groupId: number;
  userId2: string;
}

async function getGroups() {
  const response: AxiosResponse = await API.get("/groups/getGroups");
  return response.data;
}
export function usegetGroups(): UseQueryResult<any> {
  return useQuery({ queryKey: ["dataGroups"], queryFn: getGroups });
}

async function getFriends() {
  const response: AxiosResponse = await API.get("/chat/FriendsRoom");
  return response.data;
}
export function usegetFriends(): UseQueryResult<any> {
  return useQuery({ queryKey: ["dataFriend"], queryFn: getFriends });
}

export async function creatGroup(data: GroupCreate) {
  const response: AxiosResponse = await API.post("/groups/createGroup", data);
  return response.data;
}

export async function getMessages(data: messagesData) {
  const response: AxiosResponse = await API.post("/chat/getAllMessage", data);
  return response.data.allMessage;
}

export async function deleteGroup(data: idGroup) {
  const response: AxiosResponse = await API.post("/chat/removeRome", data);
  return response.data;
}

export async function addFriendToGroup(data: idGroup) {
  const response: AxiosResponse = await API.post("/chat/addFriendToGroup",data
  );
  return response.data;
}

export async function getMemberGroup(data: idGroup) {
  const response: AxiosResponse = await API.post("/chat/getMemberGroup", data);
  return response.data;
}

export async function banUserFromGroup(data: banUser) {
  const response: AxiosResponse = await API.post("/chat/banUserToGroup", data);
  return response.data;
}

export async function joinToGroup(data: Chat) {
  const response: AxiosResponse = await API.post("/chat/jounGroup", data);
  return response.data;
}

export async function checkIsGroupMember(data: idGroup) {
  const response: AxiosResponse = await API.post("/groups/memberType", data);
  return response.data;
}
