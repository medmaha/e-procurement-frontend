"use server";

import { actionRequest } from "@/lib/utils/actionRequest";

function transformStringToList(string: string, delimiter = ",") {
  const splitted = string.split(delimiter);
  const array = splitted.reduce((acc, current) => {
    if (Boolean(current) && current !== "undefined") acc.push(current);
    return acc;
  }, [] as typeof splitted);
  return array;
}

export async function createStaff(json: any) {
  const groups = String(json.group_ids) || "";
  json["group_ids"] = transformStringToList(groups);
  const response = await actionRequest({
    data: json,
    method: "post",
    url: "/organization/staffs/create/",
  });
  return response;
}

export async function updateStaff(json: Json) {
  const groups = String(json.group_ids);
  if (groups) json["group_ids"] = transformStringToList(groups);
  const response = await actionRequest({
    data: json,
    method: "put",
    url: "/organization/staffs/update/",
  });
  return response;
}

export async function getStaffs() {
  return await actionRequest({
    method: "get",
    url: "/organization/staffs/",
  });
}

export async function retrieveStaff(id: string) {
  return await actionRequest<Staff>({
    method: "get",
    url: `/organization/staffs/${id}/`,
  });
}
export async function retrieveUpdateStaff(id: string) {
  return await actionRequest<Staff>({
    method: "get",
    url: `/organization/staffs/retrieve/${id}/`,
  });
}
