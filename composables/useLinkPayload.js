function toBase64Url(bytes) {
	let binary = "";
	bytes.forEach((b) => (binary += String.fromCharCode(b)));
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function fromBase64Url(value) {
	let base64 = value.replace(/-/g, "+").replace(/_/g, "/");
	while (base64.length % 4) base64 += "=";
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

export function encodeLinkPayload(question, answer) {
	if (typeof window === "undefined") return "";
	try {
		const json = JSON.stringify({ q: question, a: answer });
		const bytes = new TextEncoder().encode(json);
		return toBase64Url(bytes);
	} catch (e) {
		return "";
	}
}

export function decodeLinkPayload(encoded) {
	if (typeof window === "undefined") return null;
	if (!encoded || typeof encoded !== "string") return null;
	try {
		const bytes = fromBase64Url(encoded);
		const json = new TextDecoder().decode(bytes);
		const parsed = JSON.parse(json);
		return {
			q: typeof parsed.q === "string" ? parsed.q : "",
			a: typeof parsed.a === "string" ? parsed.a : "",
		};
	} catch (e) {
		return null;
	}
}
