<script setup lang="ts">
defineProps<{
  count1?: number | string;
  count2?: number | string;
}>();
</script>

<template>
  <div class="user-points">
    <div class="user-points__item">
      <div class="user-points__item-icon">
        <img src="/images/user-points-icon-1.svg" alt="" />
      </div>
      <div class="user-points__item-count">{{ count1 }}</div>
    </div>
    <div v-if="count2" class="user-points__item">
      <div class="user-points__item-icon">
        <img src="/images/user-points-icon-2.svg" alt="" />
      </div>
      <div class="user-points__item-count">{{ count2 }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-points {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 24px;
  background: linear-gradient(
    90deg,
    rgba(6, 15, 20, 0) 0%,
    rgba(6, 15, 20, 0.3) 37.1%
  );
  &__item {
    display: flex;
    align-items: center;
    gap: 16px;
    &-icon {
      flex-shrink: 0;
    }
    &-count {
      font-size: 18px;
      line-height: 100%;
      color: var(--white-60);
      font-family: "Tektur", sans-serif;
    }
  }
}
</style>
