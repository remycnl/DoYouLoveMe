<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

const props = defineProps({
	questionText: { type: String, required: true },
	answerText: { type: String, required: true },
	defaultQuestion: { type: String, required: true },
	defaultAnswer: { type: String, required: true },
	maxQuestionChars: { type: Number, required: true },
	maxAnswerChars: { type: Number, required: true },
});

const router = useRouter();

const BUTTON_ENTRANCE_DELAY = 1000;

const isPanelOpen = ref(false);
const customQuestion = ref("");
const customAnswer = ref("");
const generatedLink = ref("");
const isCopied = ref(false);
const isApplied = ref(false);

function openPanel() {
	customQuestion.value =
		props.questionText === props.defaultQuestion ? "" : props.questionText;
	customAnswer.value =
		props.answerText === props.defaultAnswer ? "" : props.answerText;
	generatedLink.value = "";
	isCopied.value = false;
	isApplied.value = false;
	isPanelOpen.value = true;
}

function closePanel() {
	isPanelOpen.value = false;
}

function buildQuery() {
	const q = customQuestion.value.trim().slice(0, props.maxQuestionChars);
	const a = customAnswer.value.trim().slice(0, props.maxAnswerChars);
	return { q, a };
}

function generateLink() {
	const { q, a } = buildQuery();
	const params = new URLSearchParams();
	if (q) params.set("q", q);
	if (a) params.set("a", a);

	const base = `${window.location.origin}${window.location.pathname}`;
	generatedLink.value = params.toString()
		? `${base}?${params.toString()}`
		: base;
	isCopied.value = false;
}

async function copyLink() {
	if (!generatedLink.value) return;
	try {
		await navigator.clipboard.writeText(generatedLink.value);
		isCopied.value = true;
		setTimeout(() => (isCopied.value = false), 2000);
	} catch (e) {
		// clipboard indisponible, l'utilisateur peut sélectionner manuellement
	}
}

function applyToPage() {
	const { q, a } = buildQuery();
	const query = { ...router.currentRoute.value.query };

	if (q) query.q = q;
	else delete query.q;

	if (a) query.a = a;
	else delete query.a;

	router.replace({ query });
	isApplied.value = true;
	setTimeout(() => (isApplied.value = false), 2000);
}

function handleKeydown(event) {
	if (event.key === "Escape" && isPanelOpen.value) closePanel();
}

watch(isPanelOpen, (open) => {
	if (typeof document === "undefined") return;
	document.body.classList.toggle("native-cursor", open);
});

function playButtonEntrance() {
	const wrapper = document.getElementById("customize-button-entrance");
	if (!wrapper) return;
	gsap.to(wrapper, {
		scale: 1,
		opacity: 1,
		duration: 1.5,
		ease: "elastic.out(1, 0.3)",
	});
}

onMounted(() => {
	window.addEventListener("keydown", handleKeydown);
	if (window.innerWidth > 768) {
		setTimeout(playButtonEntrance, BUTTON_ENTRANCE_DELAY);
	}
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeydown);
	document.body.classList.remove("native-cursor");
});
</script>

<template>
	<div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
		<div id="customize-button-entrance" class="lg:scale-0 lg:opacity-0">
			<button
				id="customize-button"
				type="button"
				@click="openPanel"
				aria-haspopup="dialog"
				:aria-expanded="isPanelOpen"
				aria-controls="customize-panel"
				class="cursor-none flex items-center gap-2 rounded-full border border-white/50 bg-white/25 backdrop-blur-md px-4 py-2 text-black/70 shadow-lg shadow-black/10 transition duration-200 ease-out hover:scale-110 hover:bg-white/40 hover:text-black active:scale-90">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="w-4 h-4 shrink-0">
					<path d="M12 20h9" />
					<path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
				</svg>
				<span class="text-xs font-mono font-semibold tracking-wide"
					>personnaliser</span
				>
			</button>
		</div>
	</div>

	<Transition name="panel">
		<div
			v-if="isPanelOpen"
			class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0"
			@click.self="closePanel">
			<div
				id="customize-panel"
				role="dialog"
				aria-modal="true"
				aria-labelledby="customize-title"
				class="font-[Inter] w-full sm:w-104 bg-white/80 backdrop-blur-sm border-5 border-third text-black rounded-2xl shadow-2xl p-5">
				<div class="flex items-center justify-between mb-3">
					<h2 id="customize-title" class="text-sm font-bold tracking-wide">
						Personnaliser les phrases
					</h2>
					<button
						type="button"
						@click="closePanel"
						aria-label="Fermer"
						class="cursor-pointer! text-black/50 hover:text-black transition-colors text-lg leading-none">
						✕
					</button>
				</div>

				<label class="block text-xs mb-1 text-black/60" for="question-input">
					Question
				</label>
				<textarea
					id="question-input"
					v-model="customQuestion"
					:maxlength="maxQuestionChars"
					:placeholder="defaultQuestion"
					rows="3"
					class="scrollbar-subtle w-full resize-none rounded-lg border border-black/10 bg-primary/40 px-3 py-2 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-third"></textarea>
				<p class="text-[10px] text-black/40 mb-3 text-right">
					{{ customQuestion.length }}/{{ maxQuestionChars }}
				</p>

				<label class="block text-xs mb-1 text-black/60" for="answer-input">
					Réponse (affichée après le OUI)
				</label>
				<textarea
					id="answer-input"
					v-model="customAnswer"
					:maxlength="maxAnswerChars"
					:placeholder="defaultAnswer"
					rows="5"
					class="scrollbar-subtle w-full resize-none rounded-lg border border-black/10 bg-primary/40 px-3 py-2 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-third"></textarea>
				<p class="text-[10px] text-black/40 mb-4 text-right">
					{{ customAnswer.length }}/{{ maxAnswerChars }}
				</p>

				<div class="flex gap-2">
					<button
						type="button"
						@click="applyToPage"
						class="flex-1 cursor-pointer! bg-third text-black text-sm font-bold py-2 rounded-full hover:bg-third/70 active:scale-95 transition-all duration-200">
						{{ isApplied ? "Appliqué !" : "Appliquer ici" }}
					</button>
					<button
						type="button"
						@click="generateLink"
						class="flex-1 cursor-pointer! bg-black text-white text-sm font-bold py-2 rounded-full hover:bg-black/80 active:scale-95 transition-all duration-200">
						Générer le lien
					</button>
				</div>

				<div
					v-if="generatedLink"
					class="flex items-center mt-3 gap-2"
					aria-live="polite">
					<input
						type="text"
						readonly
						:value="generatedLink"
						class="flex-1 text-xs bg-black/5 rounded-lg px-2 py-2 truncate"
						@focus="$event.target.select()" />
					<button
						type="button"
						@click="copyLink"
						class="shrink-0 cursor-pointer! text-xs font-bold bg-third text-black px-3 py-2 rounded-lg hover:bg-third/70 active:scale-95 transition-all duration-200">
						{{ isCopied ? "Copié !" : "Copier" }}
					</button>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style>
.panel-enter-active,
.panel-leave-active {
	transition: opacity 0.25s ease;
}

.panel-enter-from,
.panel-leave-to {
	opacity: 0;
}

.scrollbar-subtle {
	scrollbar-width: thin;
	scrollbar-color: rgba(0, 0, 0, 0.12) transparent;
}

.scrollbar-subtle::-webkit-scrollbar {
	width: 4px;
}

.scrollbar-subtle::-webkit-scrollbar-track {
	background: transparent;
}

.scrollbar-subtle::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.12);
	border-radius: 999px;
}

.scrollbar-subtle:hover::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.22);
}
</style>
