<script setup lang="ts">
import DecorTitle from "@/components/uikit/DecorTitle.vue";
import UserPoints from "@/components/uikit/UserPoints.vue";
import GreenButton from "@/components/uikit/GreenButton.vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/index";
import { ref, computed, onMounted, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Grid, Pagination, Navigation } from "swiper/modules";

interface World {
  id: number;
  name: string;
}

const modules = [Grid, Pagination, Navigation];
const store = useGameStore();
const router = useRouter();
const selectedItems = ref<World[]>([]);
const maxSelection = 1;

const pagination = {
  el: ".worlds-pagination",
  clickable: true,
};
const navigation = {
  nextEl: ".worlds .slider-navigation__btn--next",
  prevEl: ".worlds .slider-navigation__btn--prev",
};

// Переключение активности
const toggleSelection = (item: World) => {
  const index = selectedItems.value.findIndex(
    (selected) => selected.id === item.id
  );

  if (index !== -1) {
    selectedItems.value.splice(index, 1);
  } else if (selectedItems.value.length < maxSelection) {
    selectedItems.value.push(item);
  }
};

// Выбор мира
const selectWorlds = async () => {
  if (selectedItems.value.length === 1) {
    const ids = selectedItems.value.map((item) => Number(item.id));

    await store.selectWorlds(ids[0]);
    router.push("/mission");
  }
};

watch(
  () => store.playerInfoArray?.selectedWorlds,
  (newValue) => {
    if (newValue) {
      selectedItems.value = newValue;
    }
  },
  { immediate: true }
);

onMounted(() => {
  store.getWorlds();
});
</script>

<template>
  <section class="worlds">
    <div class="worlds__bg">
      <img src="/images/worlds-bg.jpg" alt="" />
    </div>
    <div class="worlds__top">
      <DecorTitle
        :title="'Выбери мир для путешествий'"
        :icon="'/images/worlds-icon-top.svg'"
      />
      <UserPoints :count1="store.playerScore" />
    </div>
    <div class="worlds__slider">
      <swiper
        :slidesPerView="3"
        :grid="{
          rows: 4,
          fill: 'row',
        }"
        :spaceBetween="30"
        :slidesPerGroup="3"
        :modules="modules"
        :pagination="pagination"
        :navigation="navigation"
      >
        <swiper-slide v-for="(item, i) in store.worldsList" :key="i">
          <div
            class="worlds__item"
            :class="{
              'worlds__item--active': selectedItems.some(
                (selected) => selected.id === item.id
              ),
            }"
            @click="toggleSelection(item)"
          >
            <div class="worlds__item-wrap">{{ item.name }}</div>
          </div>
        </swiper-slide>
      </swiper>
      <div class="slider-navigation">
        <div class="slider-navigation__btn slider-navigation__btn--prev"></div>
        <div class="slider-navigation__btn slider-navigation__btn--next"></div>
      </div>
      <div class="slider-pagination worlds-pagination"></div>
    </div>
    <div class="worlds__bottom">
      <GreenButton v-if="selectedItems.length === 1" @click="selectWorlds"
        >Далее</GreenButton
      >
    </div>
  </section>
</template>

<style lang="scss">
.worlds {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  &__bg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__top {
    padding: 40px 60px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__slider {
    padding: 0 125px;
    // height: 550px;
    position: relative;

    & .swiper-slide {
      height: calc((100% - 24px) / 4) !important;
    }
  }
  &__item {
    position: relative;
    cursor: pointer;
    &-wrap {
      min-height: 114px;
      padding: 24px;
      background: var(--bg-transparent);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      line-height: 100%;
      font-weight: 600;
      color: var(--white);
      text-transform: uppercase;
      text-align: center;
      font-family: "Tektur", sans-serif;
      border: 1px solid var(--gray);
      clip-path: polygon(
        0 0,
        calc(100% - 20px) 0,
        100% 20px,
        100% 100%,
        20px 100%,
        0 calc(100% - 20px)
      );
      transition: color var(--time), border var(--time);
    }
    &::after {
      position: absolute;
      content: "";
      width: 28.1px;
      height: 1px;
      left: -4px;
      transform: rotate(45deg);
      background: var(--gray);
      bottom: 10px;
      z-index: 2;
      transition: background var(--time);
    }
    &::before {
      position: absolute;
      content: "";
      width: 28.1px;
      height: 1px;
      right: -4px;
      transform: rotate(45deg);
      background: var(--gray);
      top: 10px;
      z-index: 2;
      transition: background var(--time);
    }
    &--active {
      & .worlds__item-wrap {
        border: 1px solid var(--green);
        color: var(--green);
      }
      &::after {
        background: var(--green);
      }
      &::before {
        background: var(--green);
      }
    }
  }
  &__bottom {
    padding: 0 60px 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-height: 90px;
  }
  &__progress {
    width: 262px;
    height: 40px;
    position: relative;
    &-current {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
    }
  }
}
</style>
