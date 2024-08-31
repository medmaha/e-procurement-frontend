import { AxiosError } from "axios";

export function getCleanErrorMessage(error: AxiosError): string {
	if (error.response) {
		const message = responseText(error.response);
		if (message) return message;
	}

	if (error.status || error.response?.status) {
		const status = (error.status || error.response?.status)!;
		const message = statusText(status);
		if (message) return message;
	}

	if (error.request) {
		return "No response from server_--_Check your internet connection.";
	}

	return error.message ?? "Unknown Error";
}

function responseText(response: AxiosError["response"]) {
	return (response?.data as any)?.message;
}

function statusText(status: number) {
	const statusMessages: { [key: number]: string } = {
		400: "Invalid data passed",
		401: "Unauthorized Request",
		403: "Forbidden/Authenticated",
		404: "Resource Not Found",
		405: "Method not allowed",
		500: "Internal Server Error",
	};
	return statusMessages[status] || `Unhandled Status: ${status}`;
}
