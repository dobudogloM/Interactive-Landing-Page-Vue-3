<script setup lang="ts">
defineProps<{
  slug?: string;
}>();

defineEmits(["click"]);
</script>

<template>
  <router-link v-if="slug" class="btn btn--green" :to="slug ?? ''">
    <span><slot></slot></span>
  </router-link>
  <button v-if="!slug" class="btn btn--green" @click="$emit('click')">
    <span><slot></slot></span>
  </button>
</template>

<style lang="scss">
.btn {
  padding: 16px 40px;
  width: fit-content;
  flex-shrink: 0;
  position: relative;
  font-family: "Tektur", sans-serif;
  font-size: 18px;
  line-height: 100%;
  font-weight: 600;
  color: var(--black);
  text-transform: uppercase;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: none;
  transition: opacity var(--time);
  background: var(--transparent);
  cursor: pointer;
  min-width: 192px;
  &::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: cover;
    z-index: 0;
    transition: background-color var(--time);
  }
  &--green {
    &::after {
      background-image: url("data:image/svg+xml,%3Csvg width='192' height='55' viewBox='0 0 192 55' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H180L192 12V55H0V0Z' fill='%2327F4F8'/%3E%3Cpath d='M192 8V0H184L192 8Z' fill='%2327F4F8'/%3E%3C/svg%3E%0A");
    }
  }
  &:hover {
    opacity: 0.9;
  }
  & span {
    position: relative;
    z-index: 2;
  }
}
</style>
