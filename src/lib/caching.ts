type CacheValue = {
	payload: any;
	seconds: number;
	expiresAt: number;
};

const _cache = new Map<string, CacheValue>();

function caching() {
	const expose = {
		has: (key: string) => _cache.has(key),
		clear: () => _cache.clear(),
		delete: (key: string) => _cache.delete(key),
		set(key: string, value: any, seconds = 30) {
			if (Array.isArray(value) && value.length < 1) seconds = 0;
			if (typeof value === "object" && Object.keys(value).length < 1)
				seconds = 0;
			const data = {
				seconds,
				payload: value,
				expiresAt: new Date().getTime() + seconds * 1000,
			};
			_cache.set(key, data);
		},
		get(key: string) {
			const cached = _cache.get(key);
			if (cached) {
				const { expiresAt, seconds, payload } = cached;
				const timestamp = new Date(expiresAt);
				const now = new Date();
				const timeElapsed = now.getTime() / 1000 - timestamp.getTime() / 1000;
				if (timeElapsed < seconds) {
					return payload;
				}
				_cache.delete(key);
			}
			return null;
		},
	};
	return expose;
}
const CACHE = caching();
export default CACHE;
