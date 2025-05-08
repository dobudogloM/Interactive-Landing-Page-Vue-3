<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
  small?: boolean;
}>();
</script>

<template>
  <div class="decor-title" :class="{ 'decor-title--small': small }">
    <div class="decor-title__icon">
      <img :src="icon" alt="" />
    </div>
    <div
      class="decor-title__text"
      style="
        background: url('/images/decor-title-bg.svg') 100% no-repeat;
        background-size: contain;
        background-position: left;
      "
    >
      {{ title }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.decor-title {
  display: flex;
  align-items: center;
  gap: 8px;
  &__text {
    font-size: 40px;
    line-height: 100%;
    font-weight: 600;
    font-family: "Tektur", sans-serif;
    color: var(--white);
    text-transform: uppercase;
    padding-left: 24px;
    display: flex;
    align-items: center;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &--small {
    & .decor-title__text {
      font-size: 18px;
      height: auto;
      padding: 11px 0 8px;
      padding-left: 16px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
