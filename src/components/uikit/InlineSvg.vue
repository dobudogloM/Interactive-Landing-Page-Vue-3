<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  src: string;
  class?: string;
}>();

const containerRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (!props.src.endsWith(".svg")) return;

  try {
    const response = await fetch(props.src);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "image/svg+xml");
    const svgEl = doc.querySelector("svg");

    if (svgEl && containerRef.value) {
      if (props.class) {
        svgEl.setAttribute("class", props.class);
      }

      containerRef.value.innerHTML = "";
      containerRef.value.appendChild(svgEl);
    }
  } catch (error) {
    console.error("Ошибка загрузки SVG:", error);
  }
});
</script>

<template>
  <span ref="containerRef"></span>
</template>
