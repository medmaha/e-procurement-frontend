import { toast } from "react-toastify";

//
export function addErrorIdsToLocalStorage(value: string, key = "toastId") {
	let storage: string[];
	try {
		storage = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
		storage.push(value);
	} catch (error) {
		storage = [value];
	}
	localStorage.setItem(key, JSON.stringify(storage));
}
export function clearErrorIdsFromLocalStorage(key = "toastId") {
	let storage: string[] = [];
	try {
		storage = JSON.parse(localStorage.getItem(key) ?? "[]");
	} catch (error) {}
	storage.forEach((_id) => {
		toast.dismiss(Number(_id));
	});
}
