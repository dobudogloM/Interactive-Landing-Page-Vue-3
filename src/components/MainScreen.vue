<script setup lang="ts">
import GreenButton from "@/components/uikit/GreenButton.vue";
import IntroButton from "./uikit/IntroButton.vue";
import { useGameStore } from "@/stores/index";
import router from "@/router";
import Cookies from "js-cookie";
import { uuidv7 } from "uuidv7";
import { onMounted, ref } from "vue";

const store = useGameStore();
const userId = Cookies.get("user_id");
const mainBg = ref(false);
const skipButton = ref(true);

// Начало квиза
const startGame = async () => {
  if (!userId) {
    const newUserId = uuidv7();
    Cookies.set("user_id", newUserId, { expires: 7 });
  }

  await store.startGame();

  router.push(store.gameStage ?? "/quiz");
};

// Повтор интро
const playIntro = () => {
  const video = document.getElementById("myVideo") as HTMLVideoElement;
  mainBg.value = false;
  skipButton.value = true;
  if (video) {
    video.currentTime = 0;
    video.play();
    video.addEventListener("ended", () => {
      mainBg.value = true;
      skipButton.value = false;
    });
  }
};

// Пропуск интро
const skipIntro = () => {
  mainBg.value = true;
  skipButton.value = false;
  const video = document.getElementById("myVideo") as HTMLVideoElement;
  if (video) {
    video.pause();
  }
};

onMounted(() => {
  playIntro();
});
</script>

<template>
  <section class="main-screen">
    <div
      class="main-screen__video"
      :class="{ 'main-screen__bg--active': !mainBg }"
    >
      <video
        id="myVideo"
        src="/videos/intro.mp4"
        autoplay
        muted
        playsinline
      ></video>
    </div>
    <div
      class="main-screen__bg"
      :class="{ 'main-screen__bg--active': mainBg }"
    ></div>
    <div class="main-screen__top">
      <router-link class="main-screen__logo" to="/">
        <img src="/images/main-screen-logo.svg" alt="" />
      </router-link>
      <div class="main-screen__top-wrap">
        <IntroButton v-if="skipButton" @click="skipIntro()"
          >пропустить интро
        </IntroButton>
        <IntroButton @click="playIntro()"
          >смотреть интро
          <img src="/images/repeat-icon.svg" alt="" />
        </IntroButton>
      </div>
    </div>
    <div
      class="main-screen__content"
      :class="{ 'main-screen__content--active': mainBg }"
    >
      <div class="h1">система готова к синхронизации</div>
      <div class="main-screen__text">
        Погрузись в различные миссии, прими важное решение и узнай, насколько ты
        един с ценностями МИФИ
      </div>
      <GreenButton @click="startGame">приступить</GreenButton>
      <div class="main-screen__time font-tektur">около 6 минут</div>
    </div>
  </section>
</template>

<style lang="scss">
.main-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  &__video {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--time), visibility var(--time);
    &--active {
      opacity: 1;
      visibility: visible;
    }
    & video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &__bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    background: radial-gradient(100% 100% at 50% 0%, #153446 0%, #010101 100%);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--time), visibility var(--time);
    &--active {
      opacity: 1;
      visibility: visible;
    }
  }
  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px 60px;
    position: relative;
    z-index: 2;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    &-wrap {
      display: flex;
      gap: 16px;
    }
  }
  &__logo {
    display: block;
  }
  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
    max-width: 809px;
    width: 100%;
    margin: 0 auto;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--time), visibility var(--time);
    &--active {
      opacity: 1;
      visibility: visible;
    }
    & .btn {
      margin: 32px auto 0;
    }
  }
  &__text {
    margin: 16px auto 0;
    text-align: center;
    max-width: 492px;
    font-weight: 500;
    color: var(--white-60);
    font-size: 18px;
    line-height: 120%;
  }
  &__time {
    margin-top: 8px;
    text-align: center;
    font-size: 16px;
    line-height: 110%;
    font-weight: 500;
    color: var(--white-30);
  }
}
</style>
