<script setup lang="ts">
import DecorTitle from "@/components/uikit/DecorTitle.vue";
import UserPoints from "@/components/uikit/UserPoints.vue";
import GreenButton from "@/components/uikit/GreenButton.vue";
import { useGameStore } from "@/stores/index";
import { onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import { useRouter } from "vue-router";
import "swiper/css";

const modules = [Navigation];
const store = useGameStore();
const router = useRouter();
const navigation = {
  nextEl: ".mission .slider-navigation__btn--next",
  prevEl: ".mission .slider-navigation__btn--prev",
};

// Выбор миссии
const selectMission = async () => {
  const swiperElement = document.querySelector(
    ".mission .swiper"
  ) as HTMLElement & { swiper?: any };
  if (!swiperElement?.swiper) return;

  const activeIndex = swiperElement.swiper.activeIndex;
  const activeMission = store.missionsList[activeIndex];

  if (activeMission) {
    await store.selectMission(activeMission.id);
    router.push("/role");
  }
};

onMounted(() => {
  store.getMissions();
});
</script>

<template>
  <section class="mission">
    <div class="mission__bg"><img src="/images/mission-bg.jpg" alt="" /></div>
    <div class="mission__top">
      <DecorTitle
        :title="'Выбери миссию своей команды'"
        :icon="'/images/mission-icon-top.svg'"
      />
      <UserPoints :count1="store.playerScore" />
    </div>
    <div class="mission__slider">
      <swiper
        :centeredSlides="true"
        :slidesPerView="1.8"
        :spaceBetween="24"
        :modules="modules"
        :navigation="navigation"
      >
        <swiper-slide v-for="item in store.missionsList" :key="item.id">
          <div class="quiz__question">
            <div class="quiz__question-title">
              МИФИСТ ОДНАЖДЫ МИФИСТ НАВСЕГДА
            </div>
            <div class="quiz__question-wrap">
              {{ item.text }}
            </div>
            <div class="quiz__question-decor">
              <img src="/images/quiz-questions-decor.svg" alt="" />
            </div>
            <div class="quiz__question-decor quiz__question-decor--logo">
              <img src="/images/quiz-questions-decor-2.svg" alt="" />
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <div class="slider-navigation">
        <div class="slider-navigation__btn slider-navigation__btn--prev"></div>
        <div class="slider-navigation__btn slider-navigation__btn--next"></div>
      </div>
    </div>
    <div class="mission__bottom">
      <GreenButton @click="selectMission">Далее</GreenButton>
    </div>
  </section>
</template>

<style lang="scss">
.mission {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: space-between;
  &__bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
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
  &__bottom {
    padding: 0 60px 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__slider {
    position: relative;
    & .swiper {
      padding: 100px 0;
    }
    &::after {
      position: absolute;
      content: "";
      width: 161px;
      height: 258px;
      left: -10px;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(
        270deg,
        rgba(9, 22, 27, 0) 0%,
        #09161b 63.79%
      );

      background-image: url("data:image/svg+xml,%3Csvg width='161' height='258' viewBox='0 0 161 258' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_132_1233' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='-1' y='8' width='154' height='242'%3E%3Crect x='-1' y='8' width='154' height='242' fill='url(%23paint0_linear_132_1233)'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_132_1233)'%3E%3Cg filter='url(%23filter0_f_132_1233)'%3E%3Crect x='-1' y='8' width='154' height='242' fill='url(%23paint1_linear_132_1233)'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_f_132_1233' x='-9' y='0' width='170' height='258' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='4' result='effect1_foregroundBlur_132_1233'/%3E%3C/filter%3E%3ClinearGradient id='paint0_linear_132_1233' x1='153' y1='129' x2='-1' y2='129' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2309161B' stop-opacity='0'/%3E%3Cstop offset='0.63794' stop-color='%2309161B'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint1_linear_132_1233' x1='76' y1='8' x2='76' y2='250' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%230A171F'/%3E%3Cstop offset='0.63794' stop-color='%23060C10'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A");
      z-index: 58;
    }
    &::before {
      position: absolute;
      content: "";
      width: 161px;
      height: 258px;
      right: -10px;
      top: 50%;
      transform: translateY(-50%) rotate(180deg);

      background-image: url("data:image/svg+xml,%3Csvg width='161' height='258' viewBox='0 0 161 258' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_132_1233' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='-1' y='8' width='154' height='242'%3E%3Crect x='-1' y='8' width='154' height='242' fill='url(%23paint0_linear_132_1233)'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_132_1233)'%3E%3Cg filter='url(%23filter0_f_132_1233)'%3E%3Crect x='-1' y='8' width='154' height='242' fill='url(%23paint1_linear_132_1233)'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_f_132_1233' x='-9' y='0' width='170' height='258' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='4' result='effect1_foregroundBlur_132_1233'/%3E%3C/filter%3E%3ClinearGradient id='paint0_linear_132_1233' x1='153' y1='129' x2='-1' y2='129' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2309161B' stop-opacity='0'/%3E%3Cstop offset='0.63794' stop-color='%2309161B'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint1_linear_132_1233' x1='76' y1='8' x2='76' y2='250' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%230A171F'/%3E%3Cstop offset='0.63794' stop-color='%23060C10'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A");
      z-index: 55;
    }
  }
  & .swiper-slide {
    display: flex;
    height: auto;
    transform: scale(0.7);
    transition: transform var(--time), opacity var(--time);
    opacity: 0.2;
    &-active {
      opacity: 1;
      transform: scale(1.1);
    }
  }
  .quiz__question {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .quiz__question-wrap {
    font-size: 24px;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    line-height: 120%;
  }
}
</style>
