<script setup lang="ts">
defineProps<{
  to?: string;
}>();
</script>

<template>
  <div class="btn btn--dark" :to="to ?? ''">
    <span><slot></slot></span>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  padding: 0 40px;
  width: fit-content;
  flex-shrink: 0;
  position: relative;
  font-family: "Tektur", sans-serif;
  font-size: 18px;
  line-height: 100%;
  font-weight: 600;
  color: var(--white);
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 56px;
  cursor: pointer;
  min-width: 265px;
  &::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='267' height='57' viewBox='0 0 267 57' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1H254L266 13V56H1V1Z' fill='%23111F27' fill-opacity='0.6' stroke='%235A6A75'/%3E%3Cpath d='M266 9V1H258L266 9Z' fill='%23111F27' fill-opacity='0.6' stroke='%235A6A75'/%3E%3C/svg%3E%0A");
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 0;
    transition: background-color var(--time);
  }
  & span {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
