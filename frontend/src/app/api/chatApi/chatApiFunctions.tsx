import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { API } from "../checkAuthentication";
import { error } from "console";

interface GroupCreate {
  groupName: string;
  password: string;
  type: string;
}
interface Message {
  groupId: number
  message: string
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
  try{
    const response: AxiosResponse = await API.post("/groups/createGroup", data);
    console.log("APicaht",response.data)
    return response.data;

  }
  catch(err){
    console.log(err)
  }
}

async function getMessages(data: string) {
  console.log(23450000)
  const response: AxiosResponse = await API.get("/messages/getMessages?groupId=" + data);
  console.log(2345)
  return response.data;
}

export function useGetMessages(data: string)
{
  return useQuery({ queryKey: ["getMessages"], queryFn: () => getMessages(data) });
}


export async function deleteGroup(data: idGroup) {
  const response: AxiosResponse = await API.post("/chat/removeRome", data);
  return response.data;
}

export async function sendMessages(data: Message) {
  const response: AxiosResponse = await API.post("/messages/sendMessages", data);
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
  const response: AxiosResponse = await API.post("/groups/joinGroup", data);
  return response.data;
}

async function checkIsGroupMember(data: idGroup) {
  try{
    const response: AxiosResponse = await API.get("/groups/memberType/"+"?groupId="+data.groupId);
    return response.data;
  }
  catch(err)
  {
    console.log("err", err)
  }
}

export function useCheckIsGroupMember(data: idGroup){
  return useQuery({
    queryKey:['groupId', data.groupId],
    queryFn: () => checkIsGroupMember(data)
  })
}