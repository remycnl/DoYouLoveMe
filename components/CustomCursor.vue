<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isVisible = ref(false);
const x = ref(-100);
const y = ref(-100);
const rotation = ref(0);

const HOVER_TILT_DEG = 20;
const ROTATION_LERP = 0.3;

const CLICKABLE_SELECTOR =
	'a, button, input, select, textarea, label, [role="button"], [data-cursor-hover]';

let targetX = -100;
let targetY = -100;
let targetRotation = 0;
let currentRotation = 0;
let raf = null;

const isDesktop = ref(false);

function updateDevice() {
	isDesktop.value = window.matchMedia(
		"(hover: hover) and (pointer: fine)",
	).matches;
}

function handlePointerMove(event) {
	if (!isDesktop.value) return;

	targetX = event.clientX;
	targetY = event.clientY;

	if (!isVisible.value) isVisible.value = true;

	const isOverClickable =
		event.target instanceof Element &&
		!!event.target.closest(CLICKABLE_SELECTOR);

	targetRotation = isOverClickable ? HOVER_TILT_DEG : 0;
}

function handlePointerLeave() {
	if (!isDesktop.value) return;

	isVisible.value = false;
}

function tick() {
	x.value = targetX;
	y.value = targetY;

	currentRotation += (targetRotation - currentRotation) * ROTATION_LERP;
	rotation.value = currentRotation;

	raf = requestAnimationFrame(tick);
}

onMounted(() => {
	updateDevice();

	window.addEventListener("resize", updateDevice);
	window.addEventListener("pointermove", handlePointerMove);
	document.documentElement.addEventListener("mouseleave", handlePointerLeave);

	raf = requestAnimationFrame(tick);
});

onUnmounted(() => {
	window.removeEventListener("resize", updateDevice);
	window.removeEventListener("pointermove", handlePointerMove);
	document.documentElement.removeEventListener(
		"mouseleave",
		handlePointerLeave,
	);

	if (raf) cancelAnimationFrame(raf);
});
</script>

<template>
	<img
		v-if="isDesktop"
		src="/img/cursor.png"
		alt=""
		aria-hidden="true"
		class="custom-cursor"
		:class="{ 'custom-cursor--visible': isVisible }"
		:style="{
			transform: `translate(${x - 10}px, ${y - 10}px) rotate(${rotation.toFixed(2)}deg)`,
		}" />
</template>

<style>
.custom-cursor {
	position: fixed;
	top: 0;
	left: 0;
	width: 64px;
	height: 64px;
	pointer-events: none;
	z-index: 9999;
	opacity: 0;
	transition: opacity 0.15s ease;
	will-change: transform;
}

.custom-cursor--visible {
	opacity: 1;
}

body.native-cursor .custom-cursor {
	opacity: 0 !important;
}

@media (hover: hover) and (pointer: fine) {
	body {
		cursor: none;
	}
}

@media (hover: hover) and (pointer: fine) {
	body.native-cursor,
	body.native-cursor * {
		cursor: auto !important;
	}
}
</style>
