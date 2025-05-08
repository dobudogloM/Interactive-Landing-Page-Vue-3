<script setup lang="ts">
import DecorTitle from "@/components/uikit/DecorTitle.vue";
import UserPoints from "@/components/uikit/UserPoints.vue";
import GreenButton from "@/components/uikit/GreenButton.vue";
import { useGameStore } from "@/stores/index";
import { ref, computed, onMounted, watch } from "vue";
import router from "@/router";
import { getImagePath } from "@/utils/image";

interface Dialog {
  position: string;
  text: string;
}

interface Skill {
  name: string;
  imageUrl: string;
}

const store = useGameStore();
const background = ref("/images/quiz-bg-1.jpg");
const modalActive = ref(false);
const dialogs = ref<Dialog[]>([]);
const skills = ref<Skill[]>([]);
const disableButton = ref(false);

// Активный шаг вопроса
const step = ref(
  store.playerInfoArray?.answeredQuestions?.length &&
    store.playerInfoArray.answeredQuestions.length > 0
    ? store.playerInfoArray.answeredQuestions.length
    : 1
);

// Заполнение прогресс бара
const progressValue = computed(() => {
  const starWidth = 26;
  const starMargin = 8;
  const fullStars = Number(step.value);
  const partialStar = Number(step.value) - fullStars;
  const fillWidth =
    fullStars * (starWidth + starMargin) + partialStar * starWidth;
  const maxWidth = (fillWidth / 196) * 100;
  return maxWidth;
});

// Открытие модального окна
const openModal = (id: number) => {
  const question = store.quizList[step.value - 1];
  const selectedAnswer = question?.answers.find((answer) => answer.id === id);

  dialogs.value = selectedAnswer?.dialog ?? [];
  skills.value = selectedAnswer?.values ?? [];

  store.answerQuestion(question?.id, id);
  disableButton.value = false;
  modalActive.value = true;
};

// Переход к следующему шагу
const nextStep = () => {
  if (disableButton.value) return;

  disableButton.value = true;

  if (step.value <= store.quizList.length - 1) {
    modalActive.value = false;
    setTimeout(() => (step.value += 1), 200);
  } else {
    router.push("/identification");
  }
};

watch(
  () => store.playerInfoArray?.answeredQuestions,
  (newValue) => {
    if (newValue) {
      if (newValue.length > 0) {
        step.value = newValue.length;
      } else {
        step.value = 1;
      }
    }
  },
  { immediate: true }
);

watch(step, (newStep) => {
  const index = ((newStep - 1) % 3) + 1;
  background.value = `/images/quiz-bg-${index}.jpg`;
});

onMounted(() => {
  store.getQuiz();
});
</script>

<template>
  <section class="quiz">
    <div class="quiz__bg">
      <img :src="background" alt="" />
    </div>
    <div class="quiz__top">
      <DecorTitle :title="'Новая миссия'" :icon="'/images/quiz-icon-top.svg'" />
      <div class="quiz__top-wrap">
        <UserPoints :count1="store.playerScore" />
        <div
          class="quiz__progress"
          style="background: url('/images/quiz-progress-empty.svg') no-repeat"
        >
          <div
            class="quiz__progress-current"
            style="background: url('/images/quiz-progress-full.svg') no-repeat"
            :style="'max-width: ' + progressValue + '%'"
          ></div>
        </div>
        <div
          class="quiz__step"
          style="background: url('/images/quiz-step-bg.svg')"
        >
          {{ step }}
        </div>
      </div>
    </div>
    <div class="quiz__question">
      <div class="quiz__question-title">МИФИСТ ОДНАЖДЫ МИФИСТ НАВСЕГДА</div>
      <div
        class="quiz__question-wrap"
        v-html="store.quizList[step - 1]?.text"
      ></div>
      <div class="quiz__question-decor">
        <img src="/images/quiz-questions-decor.svg" alt="" />
      </div>
      <div class="quiz__question-decor quiz__question-decor--logo">
        <img src="/images/quiz-questions-decor-2.svg" alt="" />
      </div>
    </div>
    <div class="quiz__answer">
      <div class="quiz__answer-title">Как поступишь <span>ты?</span></div>
      <div
        class="quiz__answer-items"
        :class="{
          'quiz__answer-items--2':
            store.quizList[step - 1]?.answers.length === 2,
        }"
      >
        <div
          class="quiz__answer-item"
          v-for="(item, i) in store.quizList[step - 1]?.answers"
          :key="i"
          @click="openModal(item.id)"
        >
          <span>{{ item.answer }}</span>
        </div>
      </div>
    </div>
    <div class="quiz__modal" :class="{ 'quiz__modal--active': modalActive }">
      <div class="quiz__modal-wrap">
        <div class="quiz__modal-top">
          <div class="quiz__modal-top-wrap">
            {{ store.quizList[step - 1]?.title }}
          </div>
        </div>
        <div class="quiz__modal-content">
          <div class="quiz__modal-chat">
            <div
              class="quiz__modal-item"
              :class="{
                'quiz__modal-item--right': item.position === 'right',
                'quiz__modal-item--left': item.position === 'left',
              }"
              v-for="(item, i) in dialogs"
              :key="i"
            >
              {{ item.text }}
            </div>
          </div>
          <div class="quiz__modal-bottom">
            <div class="quiz__modal-bottom-wrap">
              <DecorTitle
                :title="'Открыты ценности'"
                :icon="'/images/modal-icon-decor.svg'"
                :small="true"
              />
              <div class="quiz__modal-achievement">
                <div
                  v-for="(item, i) in skills"
                  :key="i"
                  class="quiz__modal-achievement-item"
                >
                  <img :src="getImagePath(item.imageUrl)" alt="" />
                </div>
              </div>
            </div>
            <GreenButton @click="nextStep">К следующей миссии</GreenButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.quiz {
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
    &-wrap {
      display: flex;
      align-items: center;
    }
  }
  &__progress {
    width: 196px;
    height: 30px;
    position: relative;
    margin-left: 24px;
    &-current {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
    }
  }
  &__step {
    width: 53px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    line-height: 100%;
    font-weight: 600;
    font-family: "Tektur", sans-serif;
    color: var(--green);
    margin-left: 16px;
  }
  &__answer {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 0 60px 40px;

    &-title {
      font-size: 16px;
      line-height: 110%;
      font-weight: 500;
      font-family: "Tektur", sans-serif;
      color: var(--white-60);
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--gray);
      max-width: 285px;
      width: 100%;
      margin: 0 auto;
      position: relative;
      & span {
        color: var(--white);
      }
      &::after {
        position: absolute;
        content: "";
        bottom: 0;
        width: 16px;
        height: 4px;
        bottom: -2.4px;
        left: -3px;
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='4' viewBox='0 0 16 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.5625 2H15.8151' stroke='white'/%3E%3Cpath d='M2.5 0L4.23205 1V3L2.5 4L0.767949 3V1L2.5 0Z' fill='white'/%3E%3C/svg%3E%0A");
      }
      &::before {
        position: absolute;
        content: "";
        bottom: 0;
        width: 16px;
        height: 4px;
        bottom: -2.4px;
        right: 0;
        transform: rotate(180deg);
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='4' viewBox='0 0 16 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.5625 2H15.8151' stroke='white'/%3E%3Cpath d='M2.5 0L4.23205 1V3L2.5 4L0.767949 3V1L2.5 0Z' fill='white'/%3E%3C/svg%3E%0A");
      }
    }
    &-items {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      &--2 {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    &-item {
      position: relative;
      & span {
        width: 100%;
        height: 100%;
        padding: 24px;
        border: 1px solid var(--gray);
        background: var(--bg-transparent);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        line-height: 120%;
        font-weight: 500;
        color: var(--white);
        cursor: pointer;
        position: relative;
        clip-path: polygon(
          20px 0,
          100% 0,
          100% calc(100% - 20px),
          calc(100% - 20px) 100%,
          0 100%,
          0 20px
        );
      }
      &::after {
        position: absolute;
        content: "";
        width: 28.1px;
        height: 1px;
        left: -4px;
        transform: rotate(-45deg);
        background: var(--gray);
        top: 10px;
        z-index: 2;
      }
      &::before {
        position: absolute;
        content: "";
        width: 28.1px;
        height: 1px;
        right: -4px;
        transform: rotate(-45deg);
        background: var(--gray);
        bottom: 10px;
        z-index: 2;
      }
    }
  }
  &__question {
    max-width: 960px;
    width: 100%;
    margin: 0 auto;
    position: relative;
    &-decor {
      position: absolute;
      right: -0.3px;
      bottom: -0.3px;
      width: 57px;
      height: auto;
      z-index: 2;
      & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      &--logo {
        right: unset;
        left: -43.7px;
        bottom: unset;
        top: -63.2px;
        width: 131.7px;
        height: auto;
      }
    }
    &-wrap {
      padding: 50px;
      background: var(--bg-transparent);
      display: flex;
      flex-direction: column;
      gap: 24px;
      border: 1px solid var(--green);
      font-size: 22px;
      line-height: 28px;
      font-weight: 600;
      color: var(--white);
      position: relative;
      clip-path: polygon(
        55px 0,
        100% 0,
        100% calc(100% - 55px),
        calc(100% - 55px) 100%,
        0 100%,
        0 55px
      );
    }
    &-title {
      font-size: 16px;
      line-height: 100%;
      position: absolute;
      /* МИФИСТ ОДНАЖДЫ МИФИСТ НАВСЕГДА */

      position: absolute;
      width: 294px;
      height: 16px;
      left: 650px;
      top: -4px;

      font-family: "Tektur";
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 100%;

      background: linear-gradient(
        123.81deg,
        #ffffff 1.53%,
        rgba(255, 255, 255, 0.1) 81.28%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;

      opacity: 0.1;
      z-index: 2;
      top: -24px;
      right: 16px;
    }
    &::after {
      position: absolute;
      content: "";
      width: 12px;
      height: 12px;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 11V1H1' stroke='white' stroke-width='1.13927' stroke-linecap='round'/%3E%3C/svg%3E%0A");
      right: -20px;
      top: -20px;
    }
    &::before {
      position: absolute;
      content: "";
      width: 12px;
      height: 12px;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 11V1H1' stroke='white' stroke-width='1.13927' stroke-linecap='round'/%3E%3C/svg%3E%0A");
      left: -20px;
      bottom: -20px;
      transform: rotate(180deg);
    }
  }
  &__modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 111;
    background: rgba(6, 32, 47, 0.4);
    backdrop-filter: blur(13px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--time), visibility var(--time);
    &--active {
      opacity: 1;
      visibility: visible;
    }
    &-wrap {
      max-width: 860px;
      width: 100%;
    }
    &-top {
      position: relative;
      text-align: center;

      font-size: 28px;
      font-weight: 600;
      line-height: 36px;
      font-family: "Tektur", sans-serif;
      color: var(--white);

      &-wrap {
        padding: 12px;
        clip-path: polygon(
          30px 0,
          calc(100% - 30px) 0,
          100% 30px,
          100% 100%,
          0 100%,
          0 30px
        );
        border: 1px solid;
        border-image-source: radial-gradient(
          51.64% 100% at 50.41% 100%,
          #27f4f8 0%,
          #5a6a75 100%
        );
        border-image-slice: 1;
        background: radial-gradient(
            50% 95% at 50% 100%,
            rgba(39, 244, 248, 0.2) 0%,
            rgba(39, 244, 248, 0) 100%
          ),
          linear-gradient(0deg, #142e3d, #142e3d);
      }
      &::after {
        position: absolute;
        content: "";
        width: 41px;
        height: 1px;
        background: #5a6a75;
        z-index: 2;
        top: 15px;
        left: -5px;
        transform: rotate(-45deg);
      }
      &::before {
        position: absolute;
        content: "";
        width: 41px;
        height: 1px;
        background: #5a6a75;
        z-index: 2;
        top: 15px;
        right: -5px;
        transform: rotate(45deg);
      }
    }
    &-content {
      background: linear-gradient(
        118.37deg,
        rgba(20, 46, 61, 0.6) 29.35%,
        rgba(21, 52, 70, 0.06) 92.55%
      );
      border: 1px solid;

      border-image-source: linear-gradient(
        180deg,
        #5a6a75 0%,
        rgba(90, 106, 117, 0) 100%
      );
      border-image-slice: 1;
    }
    &-chat {
      padding: 42px 0 33px;
      width: calc(100% - 48px);
      margin-left: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: relative;
      border-bottom: 1px solid;
      border-image-source: linear-gradient(
        270deg,
        rgba(90, 106, 117, 0) 0.04%,
        #5a6a75 50.26%,
        rgba(90, 106, 117, 0) 99.94%
      );
      border-image-slice: 1;
      &::after {
        position: absolute;
        content: "";
        width: 4px;
        height: 4px;
        bottom: -2.5px;
        left: 50%;
        transform: translateX(-50%);
        background-image: url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 0L3.73205 1V3L2 4L0.267949 3V1L2 0Z' fill='white'/%3E%3C/svg%3E%0A");
      }
    }
    &-item {
      max-width: 600px;
      padding: 14px 16px;
      font-size: 18px;
      line-height: 120%;
      font-weight: 500;
      color: var(--white);
      text-wrap: balance;
      width: fit-content;

      &--left {
        clip-path: polygon(
          10px 0,
          100% 0,
          100% calc(100% - 10px),
          calc(100% - 10px) 100%,
          0 100%,
          0 10px
        );
        background: var(--bg-transparent);
      }
      &--right {
        margin-left: auto;
        background: rgba(39, 244, 248, 0.32);
        clip-path: polygon(
          0 0,
          calc(100% - 10px) 0,
          100% 10px,
          100% 100%,
          10px 100%,
          0 calc(100% - 10px)
        );
      }
    }
    &-bottom {
      padding: 32px 24px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-wrap {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    }
    &-achievement {
      display: flex;
      align-items: center;
      gap: 16px;
      &-item {
        width: 40px;
        height: 40px;
      }
    }
  }
}
</style>
