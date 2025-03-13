import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: [
		[
			"@nuxtjs/google-fonts",
			{
				families: { Allura: true },
			},
		],
	],
	css: ["@/assets/global.css"],
	nitro: {
		prerender: {
			routes: ["/"],
			failOnError: false,
		},
		preset: "vercel",
	},
	ssr: true,
	vite: {
		plugins: [tailwindcss()],
	},
});
