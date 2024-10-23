"use server";
import axios from "axios";
import { setAuthenticationCookies } from "@/lib/auth/actions";

export async function doLogin(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const url = (process.env.BACKEND_URL + "/account/login/").trim();

  try {
    const response = await axios.post(url, { email, password });
    if (response.status === 200) {
      const { access, refresh } = response.data;
      if (access && refresh) {
        await setAuthenticationCookies({ access, refresh });
        return {
          message: "You've successfully logged in to the system",
        };
      }
    }
    return {
      message: response.data.message || response.data.detail,
      error: true,
    };
  } catch (error: any) {
    const errMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Oops! Something went wrong";
    return {
      message: errMsg,
      error: true,
    };
  }
}
