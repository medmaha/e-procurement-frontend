"use server";
import { AxiosHeaders } from "axios";
import { revalidatePath } from "next/cache";
import { axiosInstance } from "@/lib/axiosInstance";
import { getCleanErrorMessage } from "../helpers/error";

export const actionRequest = async <T = any, X = Json>(
  params: RequestProps
) => {
  try {
    const { data: response, status } = await axiosInstance({
      url: params.url,
      data: params.data,
      method: params.method,
      headers: params.headers,
    });
    if (!params.noRevalidate && params.method !== "get" && params.pathname)
      revalidatePath(params.pathname, "page");

    const { id, data, extras = {}, auth_perms = {} } = response;

    console.log(data);

    return {
      id,
      data,
      auth_perms,
      status,
      extras,

      success: true,
      url: params.url,
      method: params.method,
    } as ActionRespond<T, X>;
  } catch (error: any) {
    console.log(error);

    const _error = {
      status: error?.status || error?.response?.status || 444,
      success: false,
      url: params.url,
      method: params.method,
      message: getCleanErrorMessage(error) || "Something went wrong",
    } as ActionRespond<T, X>;

    // if (Number(_error.status) === 401) {
    // 	clearAuthenticationCookies();
    // 	redirect("/account/login");
    // }
    return _error;
  }
};

type RequestProps = {
  url: string;
  method: "get" | "post" | "put" | "delete";
  data?: any;
  pathname?: string;
  noRevalidate?: boolean;
  headers?: AxiosHeaders;
};

export type ActionRespond<T, X> = {
  id?: string | number;
  message: string;
  status: number | string;
  url: string;
  method: "get" | "post" | "put" | "delete";
} & (SuccessResponse<T, X> | ErrorResponse);

type SuccessResponse<T, X> = {
  data: T;
  auth_perms: AuthPerm;
  success: true;
  extras: X;
};
type ErrorResponse = {
  success: false;
};
