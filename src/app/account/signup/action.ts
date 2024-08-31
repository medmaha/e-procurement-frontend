"use server";

import axios, { AxiosHeaders } from "axios";
import { redirect } from "next/navigation";
import { setAuthenticationCookies } from "@/lib/auth/actions";
import { getCleanErrorMessage } from "@/lib/helpers/error";
import { actionRequest } from "@/lib/utils/actionRequest";

export default async function doSignup(formData: FormData) {
	try {
		const url = (process.env.BACKEND_URL + "/account/signup/").trim();

		const { data } = await axios.post(url, formData);

		await setAuthenticationCookies(data.tokens);

		return Promise.resolve({
			success: true,
			message: data.message || "Nice! So far so good",
		});
	} catch (error: any) {
		return Promise.resolve({
			success: false,
			message: getCleanErrorMessage(error),
		});
	}
}

export async function signupComplete(formData: FormData, pathname: string) {
	const response = await actionRequest({
		method: "put",
		data: formData,
		url: process.env.BACKEND_URL + "/account/signup/complete/",
		headers: new AxiosHeaders({
			"Content-Type": "multipart/form-data",
		}),
	});
	return response;
}
