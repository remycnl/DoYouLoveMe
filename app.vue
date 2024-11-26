<template>
	<section
		class="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-hidden bg-gradient-to-r from-primary via-secondary to-third">
		<div
			class="font-[Allura] w-full h-full flex flex-col items-center justify-center">
			<Transition name="fade">
				<h1
					v-if="isYesClicked"
					class="absolute top-10 lg:top-20 text-[4rem] lg:text-[8rem] text-black text-center">
					Ooowww, I Love You Too!
				</h1>
				<h1
					v-else
					class="absolute top-10 lg:top-20 text-[4rem] lg:text-[8rem] text-black text-center">
					Do You Love Me?
				</h1>
			</Transition>

			<Transition name="fade">
				<img
					v-if="isYesClicked"
					:src="'/img/LoveYouToo.gif'"
					alt="CUTE GIF"
					class="w-full h-full absolute left-0 bottom-0" />
				<img
					v-else
					:src="'/img/DoYouLoveMe.gif'"
					alt="CUTE GIF"
					class="scale-[.65] lg:scale-90" />
			</Transition>
			<input
				v-if="!isYesClicked"
				id="yes-button"
				type="button"
				value="YES"
				@click="clickYesButton"
				class="font-mono font-bold absolute left-[30%] lg:left-[40%] top-[80%] duration-300 -translate-x-1/2 -translate-y-1/2 hover:scale-110 bg-white text-black py-3 px-8 text-[2rem] rounded-full shadow-lg hover:bg-black hover:text-white cursor-pointer" />
			<input
				v-if="!isYesClicked"
				id="no-button"
				type="button"
				value="NO"
				@mouseover="hoverNoButton"
				class="font-mono font-bold absolute left-[70%] lg:left-[60%] top-[80%] -translate-x-1/2 -translate-y-1/2 bg-black text-white py-3 px-10 text-[2rem] rounded-full shadow-lg transition-all duration-300 ease-in-out cursor-pointer" />
		</div>
	</section>
</template>

<script setup>
useHead({
	title: "Do You Love Me? 🥺",
	meta: [
		{ name: "description", content: "A simple love question" },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },

		{ property: "og:title", content: "Do You Love Me? 🥺" },
		{ property: "og:description", content: "A simple love question" },
		{ property: "og:image", content: "/img/DoYouLoveMe.gif" },
		{ property: "og:url", content: "https://doyouloveme.com" },
		{ property: "og:type", content: "website" },

		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: "Do You Love Me? 🥺" },
		{ name: "twitter:description", content: "A simple love question" },
		{ name: "twitter:image", content: "/img/DoYouLoveMe.gif" },

		{ name: "author", content: "Rémy Canal" },
		{ name: "robots", content: "index, follow" },
	],
	link: [
		{ rel: "icon", type: "image/png", href: "/favicon.png" },
		{ rel: "canonical", href: "https://doyouloveme.com" },
	],
});

const isYesClicked = ref(false);

function clickYesButton() {
	isYesClicked.value = true;
}

function hoverNoButton() {
	const x = Math.random() * window.innerWidth;
	const y = Math.random() * window.innerHeight;

	const noButton = document.getElementById("no-button");
	noButton.style.left = `${x}px`;
	noButton.style.top = `${y}px`;
}
</script>

<style scoped>
::selection {
	background: #febbcc;
	color: #ffeecc;
}

.fade-enter-active {
	transition: opacity 1s ease-in-out;
}

.fade-enter-from {
	opacity: 0;
}

.fade-enter-to {
	opacity: 1;
}
</style>
