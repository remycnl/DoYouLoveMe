<script setup>
import { gsap } from "gsap";

const route = useRoute();

const DEFAULT_QUESTION = "Do You Love Me?";
const DEFAULT_ANSWER = "Oooww...\nI Love You Too!";
const MAX_Q_CHARS = 100;
const MAX_A_CHARS = 200;

const decodedPayload = computed(() => {
	const d = route.query.d;
	if (typeof d !== "string") return null;
	return decodeLinkPayload(d);
});

const questionText = computed(() => {
	const q = decodedPayload.value?.q;
	if (typeof q === "string" && q.trim()) return q.slice(0, MAX_Q_CHARS);
	return DEFAULT_QUESTION;
});

const answerText = computed(() => {
	const a = decodedPayload.value?.a;
	if (typeof a === "string" && a.trim()) return a.slice(0, MAX_A_CHARS);
	return DEFAULT_ANSWER;
});

const isCustomQuestion = computed(
	() => questionText.value !== DEFAULT_QUESTION,
);

const activeTitle = computed(() => `${questionText.value} 🥺`);
const inactiveTitle = ref("COME BAAACK! 🥺");

const shareDescription = computed(() =>
	isCustomQuestion.value
		? `${questionText.value} Tap to find out 🥺`
		: "A simple question for a simple answer.",
);

useHead({
	title: activeTitle,
	meta: [
		{ name: "description", content: shareDescription },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
		{ property: "og:title", content: activeTitle },
		{ property: "og:description", content: shareDescription },
		{ property: "og:image", content: "/img/DoYouLoveMe.gif" },
		{ property: "og:url", content: "https://do-you-love-me-test.vercel.app" },
		{ property: "og:type", content: "website" },
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: activeTitle },
		{ name: "twitter:description", content: shareDescription },
		{ name: "twitter:image", content: "/img/DoYouLoveMe.gif" },
		{ name: "author", content: "Rémy Canal" },
		{ name: "robots", content: "index, follow" },
	],
	link: [{ rel: "canonical", href: "https://do-you-love-me-test.vercel.app" }],
});

const isDesktop = ref(false);
const isYesClicked = ref(false);

const IMAGE_DELAY = 150;
const TEXT_DELAY = 800;
const YES_DELAY = 700;
const NO_DELAY = 850;

const AVOID_RADIUS = 110;
const SAFE_MARGIN = 60;
const MIN_JUMP_DISTANCE = 220;
const REARM_RADIUS = AVOID_RADIUS * 1.8;
const CURSOR_EXCLUSION_RADIUS = 150;
const MAX_RETARGET_ATTEMPTS = 4;

let isFleeing = false;
const lastPointer = { x: null, y: null };

function longestLineLength(text) {
	return Math.max(...text.split("\n").map((line) => line.length), 1);
}

function scaledFontSize(text, { min, max, base, baseChars, softness = 0.5 }) {
	const len = longestLineLength(text);
	if (len <= baseChars) return `${base}rem`;

	const ratio = baseChars / len;
	const size = base * Math.pow(ratio, softness);
	return `${Math.min(max, Math.max(min, size)).toFixed(2)}rem`;
}

const questionFontSize = computed(() =>
	scaledFontSize(
		questionText.value,
		isDesktop.value
			? { min: 3.5, max: 8, base: 8, baseChars: 15, softness: 0.5 }
			: { min: 2, max: 4, base: 4, baseChars: 12, softness: 0.5 },
	),
);

const answerFontSize = computed(() =>
	scaledFontSize(
		answerText.value,
		isDesktop.value
			? { min: 3, max: 10, base: 10, baseChars: 16, softness: 0.5 }
			: { min: 1.75, max: 4, base: 4, baseChars: 12, softness: 0.5 },
	),
);

function clickYesButton() {
	isYesClicked.value = true;
}

function pointInRect(px, py, x, y, width, height, padding = 0) {
	return (
		px >= x - padding &&
		px <= x + width + padding &&
		py >= y - padding &&
		py <= y + height + padding
	);
}

function isCustomizePanelOpen() {
	if (typeof document === "undefined") return false;
	return document.body.classList.contains("native-cursor");
}

function moveNoButton(clientX = null, clientY = null, attempt = 0) {
	const noButton = document.getElementById("no-button");
	if (!noButton) return;

	const rect = noButton.getBoundingClientRect();
	const duration = isDesktop.value ? 0.55 : 0.35;

	const maxX = window.innerWidth - rect.width - SAFE_MARGIN * 2;
	const maxY = window.innerHeight - rect.height - SAFE_MARGIN * 2;

	let x,
		y,
		tries = 0;
	let bestX = null,
		bestY = null,
		bestDist = -1;

	do {
		x = SAFE_MARGIN + Math.random() * maxX;
		y = SAFE_MARGIN + Math.random() * maxY;
		tries++;

		if (clientX !== null) {
			const centerDist = Math.hypot(
				x + rect.width / 2 - clientX,
				y + rect.height / 2 - clientY,
			);
			const overlapsCursor = pointInRect(
				clientX,
				clientY,
				x,
				y,
				rect.width,
				rect.height,
				20,
			);
			const tooClose = centerDist < CURSOR_EXCLUSION_RADIUS;

			if (overlapsCursor || tooClose) continue;

			if (centerDist > bestDist) {
				bestDist = centerDist;
				bestX = x;
				bestY = y;
			}
			if (centerDist >= MIN_JUMP_DISTANCE) break;
		} else {
			break;
		}
	} while (tries < 20);

	if (clientX !== null && bestDist >= 0 && bestDist < MIN_JUMP_DISTANCE) {
		x = bestX;
		y = bestY;
	}

	isFleeing = true;

	gsap.to(noButton, {
		left: `${x}px`,
		top: `${y}px`,
		duration,
		ease: "power2.out",
		onComplete: () => {
			const newRect = noButton.getBoundingClientRect();
			const mx = lastPointer.x;
			const my = lastPointer.y;

			if (
				mx !== null &&
				pointInRect(
					mx,
					my,
					newRect.left,
					newRect.top,
					newRect.width,
					newRect.height,
					20,
				) &&
				attempt < MAX_RETARGET_ATTEMPTS
			) {
				moveNoButton(mx, my, attempt + 1);
				return;
			}

			const centerX = newRect.left + newRect.width / 2;
			const centerY = newRect.top + newRect.height / 2;
			if (
				mx === null ||
				Math.hypot(mx - centerX, my - centerY) > REARM_RADIUS
			) {
				isFleeing = false;
			}
		},
	});
}

function handlePointerMove(event) {
	lastPointer.x = event.clientX;
	lastPointer.y = event.clientY;

	if (!isDesktop.value || isYesClicked.value || isCustomizePanelOpen()) return;

	const noButton = document.getElementById("no-button");
	if (!noButton) return;

	const rect = noButton.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;
	const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

	if (distance < AVOID_RADIUS) {
		if (isFleeing) return;
		moveNoButton(event.clientX, event.clientY);
	} else if (distance > REARM_RADIUS) {
		isFleeing = false;
	}
}

function applyElasticEffect(elementName, easeEffect, duration) {
	const element = document.getElementById(elementName);
	if (!element) return;

	gsap.to(element, {
		scale: 1,
		opacity: 1,
		duration,
		ease: easeEffect,
	});
}

function applyImageEntrance(elementName, bounceEase, duration) {
	const element = document.getElementById(elementName);
	if (!element) return;

	gsap.to(element, {
		opacity: 1,
		duration: duration * 0.4,
		ease: "power2.out",
	});

	gsap.to(element, {
		scale: 1,
		duration,
		ease: bounceEase,
	});
}

function handleVisibilityChange() {
	document.title =
		document.visibilityState === "hidden"
			? inactiveTitle.value
			: activeTitle.value;
}

function updateWidth() {
	isDesktop.value = window.innerWidth > 768;
}

onMounted(() => {
	updateWidth();
	window.addEventListener("resize", updateWidth);
	window.addEventListener("pointermove", handlePointerMove);
	document.addEventListener("visibilitychange", handleVisibilityChange);

	if (isDesktop.value) {
		setTimeout(
			() => applyImageEntrance("do-you-love-me", "elastic.out(1, 0.9)", 2),
			IMAGE_DELAY,
		);
		setTimeout(
			() => applyElasticEffect("yes-button", "elastic.out(1, 0.3)", 1.5),
			YES_DELAY,
		);
		setTimeout(
			() => applyElasticEffect("no-button", "elastic.out(1, 0.3)", 1.5),
			NO_DELAY,
		);
	}
});

onUnmounted(() => {
	window.removeEventListener("resize", updateWidth);
	window.removeEventListener("pointermove", handlePointerMove);
	document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<template>
	<section
		class="fixed cursor-none top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-hidden bg-linear-to-r from-primary via-secondary to-third">
		<div
			class="font-[Allura] w-full h-full flex flex-col items-center justify-center">
			<Transition name="fade">
				<h1
					v-if="isYesClicked"
					:style="{ fontSize: answerFontSize }"
					class="absolute top-10 lg:top-20 lg:right-60 max-w-[92vw] lg:max-w-[45vw] whitespace-pre-line text-black text-left">
					{{ answerText }}
				</h1>
				<div
					v-else
					:style="{ fontSize: questionFontSize }"
					class="absolute top-10 lg:top-20 max-w-[92vw] lg:max-w-[70vw] whitespace-pre-line text-black text-center">
					<h1 class="lg:hidden">{{ questionText }}</h1>
					<span class="hidden lg:block">
						<LetterByLetter :text="questionText" :start-delay="TEXT_DELAY" />
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
					class="scale-[.65] lg:scale-[1.6] lg:opacity-0" />
			</Transition>
			<input
				v-if="!isYesClicked"
				id="yes-button"
				type="button"
				value="YES"
				@click="clickYesButton"
				class="lg:scale-0 absolute left-[30%] lg:left-[40%] top-[80%] lg:top-[84%] font-mono font-bold -translate-x-1/2 -translate-y-1/2 bg-white text-black py-3 px-8 text-[2rem] rounded-full shadow-lg hover:bg-black hover:text-white cursor-none transition-colors duration-200" />
			<input
				v-if="!isYesClicked"
				id="no-button"
				type="button"
				value="NO"
				@click="isDesktop ? null : moveNoButton()"
				class="lg:scale-0 absolute left-[70%] lg:left-[60%] top-[80%] lg:top-[84%] font-mono font-bold bg-black -translate-x-1/2 -translate-y-1/2 text-white py-3 px-10 text-[2rem] rounded-full shadow-lg cursor-none" />
		</div>

		<LoveCustomizer
			:question-text="questionText"
			:answer-text="answerText"
			:default-question="DEFAULT_QUESTION"
			:default-answer="DEFAULT_ANSWER"
			:max-question-chars="MAX_Q_CHARS"
			:max-answer-chars="MAX_A_CHARS" />
	</section>
	<CustomCursor />
</template>

<style>
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
