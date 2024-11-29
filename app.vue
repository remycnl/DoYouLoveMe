<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import { Transition } from "vue";
import LetterByLetter from "./LetterByLetter.vue";

const activeTitle = ref("Do You Love Me? 🥺");
const inactiveTitle = ref("COME BAAACK! 🥺");

useHead({
	title: activeTitle,
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

const isDesktop = ref(false);
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

const applyElasticEffect = (elementName, easeEffect, duration) => {
	const element = document.getElementById(elementName);

	if (element) {
		gsap.to(element, {
			scale: 1,
			opacity: 1,
			duration: duration,
			ease: easeEffect,
			onComplete: () => {
				if (element.id === "no-button" || element.id === "yes-button") {
					element.classList.add(
						"transition-all",
						"duration-300",
						"ease-in-out"
					);
				}
			},
		});
	} else {
		console.warn(`Aucun élément trouvé avec id="${elementName}"`);
	}
};

const setSEO = () => {
	if (import.meta.client) {
		document.addEventListener("visibilitychange", function () {
			if (document.visibilityState === "hidden") {
				document.title = inactiveTitle.value;
			} else {
				document.title = activeTitle.value;
			}
		});
	}
};

onMounted(() => {
	const updateWidth = () => {
		isDesktop.value = window.innerWidth > 768;
	};

	updateWidth();
	window.addEventListener("resize", updateWidth);

	onBeforeUnmount(() => {
		window.removeEventListener("resize", updateWidth);
	});

	setSEO();
	if (isDesktop.value) {
		setTimeout(() => {
			applyElasticEffect("do-you-love-me", "elastic.out(1, 0.9)", 2);
		}, 2000);
		setTimeout(() => {
			applyElasticEffect("yes-button", "elastic.out(1, 0.3)", 1.5);
		}, 5500);
		setTimeout(() => {
			applyElasticEffect("no-button", "elastic.out(1, 0.3)", 1.5);
			cl;
		}, 6000);
	} else {
		const noButton = document.getElementById("no-button");
		noButton.classList.add("transition-all", "duration-300", "ease-in-out");
	}
});
</script>

<template>
	<section
		class="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-hidden bg-gradient-to-r from-primary via-secondary to-third">
		<div
			class="font-[Allura] w-full h-full flex flex-col items-center justify-center">
			<Transition name="fade">
				<h1
					v-if="isYesClicked"
					class="absolute top-10 lg:top-20 lg:right-60 text-[4rem] lg:text-[10rem] text-black text-left">
					Oooww...<br />I Love You Too!
				</h1>
				<div
					v-else
					class="absolute top-10 lg:top-20 text-[4rem] lg:text-[8rem] text-black text-center">
					<h1 class="lg:hidden">Do You Love Me?</h1>
					<span class="hidden lg:block">
						<LetterByLetter :text="'Do You Love Me?'" />
					</span>
				</div>
			</Transition>
			<Transition name="fade">
				<img
					v-if="isYesClicked"
					:src="'/img/LoveYouToo.gif'"
					id="love-you-too"
					alt="CUTE GIF"
					name="I love you too!"
					class="w-auto h-1/2 absolute left-0 bottom-0" />
				<img
					v-else
					:src="'/img/DoYouLoveMe.gif'"
					id="do-you-love-me"
					alt="CUTE GIF"
					name="Do you love me?"
					class="scale-[.65] lg:scale-[10]" />
			</Transition>
			<input
				v-if="!isYesClicked"
				id="yes-button"
				type="button"
				value="YES"
				@click="clickYesButton"
				class="lg:scale-0 absolute left-[30%] lg:left-[40%] top-[80%] lg:top-[84%] font-mono font-bold -translate-x-1/2 -translate-y-1/2 hover:scale-110 bg-white text-black py-3 px-8 text-[2rem] rounded-full shadow-lg hover:bg-black hover:text-white cursor-pointer" />
			<input
				v-if="!isYesClicked"
				id="no-button"
				type="button"
				value="NO"
				@mouseover="hoverNoButton"
				class="lg:scale-0 absolute left-[70%] lg:left-[60%] top-[80%] lg:top-[84%] font-mono font-bold bg-black -translate-x-1/2 -translate-y-1/2 text-white py-3 px-10 text-[2rem] rounded-full shadow-lg cursor-pointer" />
		</div>
	</section>
</template>

<style scoped>
::selection {
	background: #febbcc;
	color: #ffeecc;
}

.fade-enter-active {
	transition: opacity 1.5s ease-in-out;
}

.fade-enter-from {
	opacity: 0;
}

.fade-enter-to {
	opacity: 1;
}
</style>
