"use server";

import axios from "axios";
import { cookies } from "next/headers";
import {
	ACCESS_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_NAME,
} from "./auth/constants";
import { getAuthenticatedUser } from "./auth/generics";
import { NextResponse } from "next/server";

const controller = new AbortController();

export const axiosInstance = axios.create({
	baseURL: process.env.BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
	},
	signal: controller.signal,
	withCredentials: false,
});

axiosInstance.interceptors.request.use(
	async (config) => {
		const authUser = await getAuthenticatedUser();
		if (!authUser) {
			console.log(authUser);
			controller.abort();
			NextResponse.redirect(process.env.BASE_URL + "/account/login");
		}
		const accessToken = cookies().get(ACCESS_TOKEN_COOKIE_NAME)?.value;
		const refreshToken = cookies().get(REFRESH_TOKEN_COOKIE_NAME)?.value;

		config.headers["Authorization"] = "Bearer " + accessToken;
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
);
