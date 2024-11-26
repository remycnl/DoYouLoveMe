<template>
	<div
		class="overflow-hidden bg-gradient-to-r from-primary via-secondary to-third font-[Allura] h-screen w-screen flex flex-col items-center justify-center">
		<transition name="fade" @enter="enter">
			<h1
				v-if="isYesClicked"
				class="absolute top-20 text-[8rem] text-black text-center">
				Ooowww, I Love You Too!
			</h1>
			<h1 v-else class="absolute top-20 text-[8rem] text-black text-center">
				Do You Love Me?
			</h1>
		</transition>

		<transition name="fade" @enter="enter">
			<img
				v-if="isYesClicked"
				:src="'/img/LoveYouToo.gif'"
				alt="CUTE GIF"
				class="w-full h-full absolute left-0 bottom-0" />
			<img v-else :src="'/img/DoYouLoveMe.gif'" alt="CUTE GIF" class="scale-90" />
		</transition>
		<input
			v-if="!isYesClicked"
			id="yes-button"
			type="button"
			value="YES"
			@click="clickYesButton"
			class="font-mono font-bold absolute left-[40%] top-[80%] duration-300 -translate-x-1/2 -translate-y-1/2 hover:scale-110 bg-white text-black py-3 px-8 text-[2rem] rounded-full shadow-lg hover:bg-black hover:text-white cursor-pointer" />
		<input
			v-if="!isYesClicked"
			id="no-button"
			type="button"
			value="NO"
			@mouseover="hoverNoButton"
			class="font-mono font-bold absolute left-[60%] top-[80%] -translate-x-1/2 -translate-y-1/2 bg-black text-white py-3 px-8 text-[2rem] rounded-full shadow-lg transition-all duration-300 ease-in-out cursor-pointer" />
	</div>
</template>

<script setup>
useHead({
	title: "Do You Love Me? 🥺",
	meta: [{ name: "description", content: "A simple love question" }],
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
	transition: opacity 0.5s ease-in-out;
}

.fade-enter {
	opacity: 0;
}

.fade-enter-to {
	opacity: 1;
}
</style>
