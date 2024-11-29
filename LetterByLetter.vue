<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
	text: {
		type: String,
		required: true,
	},
});

const splitText = computed(() => props.text.split(""));

const isActive = ref(false);

onMounted(() => {
	setTimeout(() => {
		isActive.value = true;
	}, 4000);
});

function getStyle(index) {
	return {
		transitionDelay: `${index * 0.08}s`,
	};
}
</script>

<template>
	<h1>
		<span
			v-for="(letter, index) in splitText"
			:key="index"
			class="letter"
			:class="{ active: isActive }"
			:style="getStyle(index)">
			{{ letter === " " ? "\u00A0" : letter }}
		</span>
	</h1>
</template>

<style scoped>
::selection {
	background: #febbcc;
	color: #ffeecc;
}

.letter {
	display: inline-block;
	opacity: 0;
	transform: translateX(30px) translateY(-30px) rotate(-10deg);
	transition: opacity 0.3s ease, transform 0.3s ease;
}

.letter.active {
	opacity: 1;
	transform: translateX(0) translateY(0) rotate(0);
}
</style>
