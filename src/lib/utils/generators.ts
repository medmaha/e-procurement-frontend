export function generateHex(length = 6, options?: { withLowerCase: boolean }) {
	const numbers = "0123456789";
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	const characters =
		numbers + letters + options?.withLowerCase ? letters.toLowerCase() : "";

	let hex = "";

	for (let i = 0; i < length; i++) {
		hex += characters[Math.floor(Math.random() * characters.length)];
	}

	return hex;
}
