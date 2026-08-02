import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2026-08-01",
	devtools: { enabled: true },
	modules: [
		[
			"@nuxtjs/google-fonts",
			{
				families: { Allura: true, Inter: [400, 500, 600, 700] },
			},
		],
	],
	css: ["@/assets/global.css"],
	nitro: {
		preset: "vercel",
	},
	ssr: true,
	vite: {
		plugins: [tailwindcss()],
	},
});
