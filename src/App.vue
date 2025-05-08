<script setup lang="ts">
import { uuidv7 } from "uuidv7";
import Cookies from "js-cookie";
import PageLoader from "@/components/uikit/PageLoader.vue";
import { useGameStore } from "@/stores/index";
// import { onMounted } from "vue";

const store = useGameStore();
const userId = Cookies.get("user_id");

if (!userId) {
  const newUserId = uuidv7();
  Cookies.set("user_id", newUserId, { expires: 7 });
}

// onMounted(() => store.startGame());
</script>

<template>
  <router-view />
  <PageLoader :class="{ 'loader--active': store.loader }" />
</template>

<style lang="scss"></style>
