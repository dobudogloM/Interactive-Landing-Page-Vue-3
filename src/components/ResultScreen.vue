<script setup lang="ts">
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/index";
import IntroButton from "./uikit/IntroButton.vue";
import UserPoints from "@/components/uikit/UserPoints.vue";
import InlineSvg from "@/components/uikit/InlineSvg.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Navigation } from "swiper/modules";
import Cookies from "js-cookie";
import { computed, ref, onMounted } from "vue";
import { getImagePath } from "@/utils/image";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const store = useGameStore();
const router = useRouter();
const modules = [Navigation];
const pdfRef = ref<HTMLElement | null>(null);
const starCount = 7;
const starWidth = 11;
const starMargin = 3;
const currentStars = computed(() => store.resultsList?.worthCount || 0);
const advantagesModal = ref(false);
const feedbackModal = ref(false);
const worthTitle = ref("");
const committeeInfo = ref(false);

const navigation = {
  nextEl: ".result__worth-next",
};

const navigation_worlds = {
  nextEl: ".result__worlds .slider-navigation__btn--next",
  prevEl: ".result__worlds .slider-navigation__btn--prev",
};

// Заполнение прогресс бара
const progressValue = computed(() => {
  const fullWidth = starCount * starWidth + (starCount - 1) * starMargin;
  const currentWidth =
    currentStars.value * starWidth +
    Math.max(currentStars.value - 1, 0) * starMargin;
  const maxWidth = (currentWidth / fullWidth) * 100;
  return maxWidth;
});

// Перезапуск игры
const repeatQuest = () => {
  Cookies.remove("user_id");
  router.push("/");
};

// Активность слайда при смене
const handleSlideChange = (swiper: any) => {
  const activeSlide = store.playerInfoArray?.selectedSkills[swiper.realIndex];
  if (activeSlide) {
    worthTitle.value = activeSlide.name;
  }
};

// Закрытие модалки обратная связь
const closeFeedbackModal = () => {
  feedbackModal.value = false;
  setTimeout(() => {
    committeeInfo.value = false;
  }, 300);
};

// Открытие модалки приемной комиссии
const openInspection = () => {
  committeeInfo.value = true;
  feedbackModal.value = true;
};

// Генерация PDF
const generatePdf = async () => {
  const doc = new jsPDF("landscape", "mm", "a4");
  const content = pdfRef.value;

  if (content) {
    html2canvas(content, { scale: 1 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        const imgWidth = Math.min(pageWidth, canvas.width);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const scaleFactor = Math.min(
          pageWidth / canvas.width,
          pageHeight / canvas.height
        );
        const finalWidth = canvas.width * scaleFactor;
        const finalHeight = canvas.height * scaleFactor;

        const offsetX = (pageWidth - finalWidth) / 2;
        const offsetY = (pageHeight - finalHeight) / 2;

        doc.addImage(imgData, "PNG", offsetX, offsetY, finalWidth, finalHeight);

        doc.save("result.pdf");
      })
      .catch((error) => {
        console.error("Ошибка при преобразовании в изображение:", error);
      });
  }
};

onMounted(() => {
  store.getResults();
  store.getContacts();
  store.getAchievements();
  store.getСommittee();
});
</script>

<template>
  <section id="pdfTarget" class="result" ref="pdfRef">
    <div class="result__bg">
      <img src="/images/result-bg.jpg" alt="" />
    </div>
    <div class="result__top">
      <div class="result__info">
        <div class="result__info-logo">
          <img src="/images/result-info-logo.svg" alt="" />
        </div>
        <div class="result__info-wrap">
          <div class="result__info-position">
            {{ store.playerInfoArray?.selectedCharacter?.name }}
          </div>
          <div class="result__info-sinhro">
            <div class="result__info-title">Синхронизация</div>
            <div class="result__info-value">
              {{ store.resultsList?.totalScore }}/100
            </div>
          </div>
          <div class="result__info-line">
            <div
              class="result__info-line-current"
              :style="'max-width: ' + store.resultsList?.totalScore + '%'"
            ></div>
          </div>
        </div>
      </div>
      <div class="result__top-wrap">
        <UserPoints :count1="store.resultsList?.worthCount" :count2="5" />
        <IntroButton @click="repeatQuest"
          >пройти заново
          <img src="/images/repeat-icon.svg" alt="" />
        </IntroButton>
      </div>
    </div>
    <div class="result__content">
      <div class="result__content-decor result__content-decor--top-left"></div>
      <div class="result__content-decor result__content-decor--top-right"></div>
      <div
        class="result__content-decor result__content-decor--bottom-left"
      ></div>
      <div
        class="result__content-decor result__content-decor--bottom-right"
      ></div>
      <div class="result__middle">
        <div class="result__worlds">
          <swiper
            :modules="modules"
            :spaceBetween="16"
            :slidesPerView="3"
            :direction="'vertical'"
            :navigation="navigation_worlds"
          >
            <swiper-slide
              v-for="(item, i) in store.resultsList?.studyAreas"
              :key="i"
            >
              <a
                class="result__world"
                :href="item.link"
                target="_blank"
                :style="'background: url(/images/result-worlds-bg.png) no-repeat'"
              >
                <div class="result__world-title">{{ item.code }}</div>
                <div class="result__world-text">{{ item.name }}</div>
              </a>
            </swiper-slide>
          </swiper>
          <div class="result__worlds-nav">
            <div
              class="slider-navigation__btn slider-navigation__btn--prev"
            ></div>
            <div
              class="slider-navigation__btn slider-navigation__btn--next"
            ></div>
          </div>
        </div>
        <div class="result__middle-right">
          <div class="result__create">
            <div class="result__create-wrap">
              <div class="result__create-title">Командная миссия</div>
              <div class="result__create-subtitle">
                {{ store.resultsList?.mission?.title }}
              </div>
              <div class="result__create-text">
                {{ store.resultsList?.mission?.description }}
              </div>
            </div>
            <div class="result__create-image">
              <img src="/images/create-image.png" alt="" />
            </div>
            <div class="result__create-line result__create-line--1"></div>
            <div class="result__create-line result__create-line--2"></div>
          </div>
          <div class="result__sinhro">
            <div class="result__sinhro-bg">
              <img src="/images/result-sinhro-bg.png" alt="" />
            </div>
            <div class="result__sinhro-title">СИНХРОНИЗАЦИЯ</div>
            <div
              class="result__sinhro-total"
              style="
                background: url('/images/result-sinhro-total-bg.png') no-repeat;
              "
            >
              {{ store.resultsList?.totalScore }}
            </div>
            <div class="result__worth">
              <swiper
                :slidesPerView="4"
                :modules="modules"
                :navigation="navigation"
                :spaceBetween="8"
                :loop="true"
                @slideChange="handleSlideChange"
              >
                <swiper-slide
                  v-for="(item, i) in store.playerInfoArray?.selectedSkills"
                  :key="i"
                >
                  <div class="result__worth-item">
                    <InlineSvg
                      :src="'/images/' + item.icon + '.svg'"
                      class="my-custom-icon"
                    />
                  </div>
                </swiper-slide>
              </swiper>
              <div class="result__worth-next"></div>
            </div>
            <div class="result__sinhro-subtitle">{{ worthTitle }}</div>
            <div class="result__values">
              <div class="result__values-title">Открыто ценностей</div>
              <div class="result__values-wrap">
                <div
                  class="result__values-progress"
                  style="
                    background: url('/images/result-values-progress-empty.svg')
                      no-repeat;
                  "
                >
                  <div
                    class="result__values-progress-current"
                    style="
                      background: url('/images/result-values-progress-full.svg')
                        no-repeat;
                    "
                    :style="'max-width: ' + progressValue + '%'"
                  ></div>
                </div>
                <div class="result__values-total">
                  {{ store.resultsList?.worthCount }}/{{
                    store.resultsList?.totalWorthCount
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="result__bottom">
        <div class="result__inspection" @click="openInspection">
          <div class="result__inspection-wrap">
            <img src="/images/result-inspection-icon.svg" alt="" />
            <span class="result__inspection-title">Приемная комиссия</span>
            <span class="result__inspection-text"
              >: Не стесняйся задать вопрос!</span
            >
          </div>
          <div class="result__inspection-count">+1</div>
          <div class="result__inspection-decor"></div>
        </div>
        <div class="result__skills">
          <div class="result__skills-item" @click="advantagesModal = true">
            <div class="result__skills-item-wrap">
              <div class="result__skills-icon">
                <img src="/images/result-skills-icon-1.svg" alt="" />
              </div>
              <div class="result__skills-text">Достижения</div>
            </div>
            <div class="result__skills-tag">НОВОЕ</div>
          </div>
          <div class="result__skills-item" @click="generatePdf">
            <div class="result__skills-item-wrap">
              <div class="result__skills-icon">
                <img src="/images/result-skills-icon-2.svg" alt="" />
              </div>
              <div class="result__skills-text">Скачать</div>
            </div>
          </div>
        </div>
        <div class="result__feedback" @click="feedbackModal = true">
          <img src="/images/result-feedback-icon.svg" alt="" />
        </div>
      </div>
      <div class="result__image">
        <img
          :src="
            getImagePath(store.playerInfoArray?.selectedCharacter?.imagePath)
          "
          alt=""
        />
      </div>
    </div>
    <div
      class="advantages-modal"
      :class="{ 'advantages-modal--active': advantagesModal }"
    >
      <div class="advantages-modal__wrap">
        <div
          class="advantages-modal__close"
          @click="advantagesModal = false"
        ></div>
        <div class="advantages-modal__top">
          <div class="advantages-modal__top-wrap">Достижения</div>
        </div>
        <div class="advantages-modal__content">
          <div class="advantages-modal__content-wrap">
            <div class="advantages-modal__title">Скиллы</div>
            <div class="advantages-modal__items">
              <div
                v-for="(item, i) in store.achievementsList?.skills"
                :key="i"
                class="advantages-modal__item"
                :class="{ 'advantages-modal__item--active': item.isActive }"
              >
                <div class="advantages-modal__item-wrap">
                  <div class="advantages-modal__item-image">
                    <img :src="getImagePath(item.icon)" alt="" />
                  </div>
                  <div class="advantages-modal__item-title">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="advantages-modal__content-wrap">
            <div class="advantages-modal__title">ценности</div>
            <div class="advantages-modal__items advantages-modal__items--worth">
              <div
                v-for="(item, i) in store.achievementsList?.values"
                :key="i"
                class="advantages-modal__item advantages-modal__item--worth"
                :class="{ 'advantages-modal__item--active': item.isActive }"
              >
                <div class="advantages-modal__item-wrap">
                  <div class="advantages-modal__item-image">
                    <img :src="getImagePath(item.icon)" alt="" />
                  </div>
                  <div class="advantages-modal__item-title">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="feedback" :class="{ 'feedback--active': feedbackModal }">
      <div class="feedback__wrap">
        <div class="feedback__top">
          <div class="feedback__back" @click="closeFeedbackModal">
            Вернуться
          </div>
          <div class="feedback__title">Обратная связь</div>
        </div>
        <div class="feedback__content">
          <div v-if="!committeeInfo" class="feedback__items">
            <a
              v-for="(item, i) in store.contactsList"
              :key="i"
              :href="item.link"
              target="_blank"
              class="feedback__item"
            >
              <div class="feedback__item-wrap">
                <div class="feedback__item-image">
                  <img :src="getImagePath(item.imagePath)" alt="" />
                </div>
                <div class="feedback__item-title">
                  {{ item.name }}
                </div>
              </div>
              <div class="feedback__item-social">
                <img src="/images/feedback-socilas-icon.svg" alt="" />
              </div>
            </a>
          </div>
          <div v-if="committeeInfo" class="feedback__items">
            <a
              :href="store.committeeList?.link"
              target="_blank"
              class="feedback__item"
            >
              <div class="feedback__item-wrap">
                <div class="feedback__item-image">
                  <img
                    :src="getImagePath(store.committeeList?.imagePath)"
                    alt=""
                  />
                </div>
                <div class="feedback__item-title">
                  {{ store.committeeList?.name }}
                </div>
              </div>
              <div class="feedback__item-social">
                <img src="/images/feedback-socilas-icon.svg" alt="" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.result {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__top {
    padding: 12px 60px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
    &-wrap {
      display: flex;
      align-items: center;
      gap: 32px;
    }
  }
  &__info {
    padding: 8px;
    padding-right: 35px;
    background: linear-gradient(
      90deg,
      rgba(6, 15, 20, 0) 0%,
      rgba(6, 15, 20, 0.5) 37.1%
    );
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 383px;
    width: 100%;
    &-logo {
      width: 64px;
      height: 64px;
      flex-shrink: 0;
      background: radial-gradient(
          50% 95% at 50% 100%,
          rgba(39, 244, 248, 0.2) 0%,
          rgba(39, 244, 248, 0) 100%
        ),
        linear-gradient(0deg, #142e3d, #142e3d);

      border: 1px solid var(--gray);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-wrap {
      max-width: 260px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    &-position {
      font-size: 20px;
      line-height: 26px;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--white);
      font-family: "Tektur", sans-serif;
    }
    &-sinhro {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    &-title {
      font-size: 14px;
      line-height: 16px;
      font-weight: 600;
      color: var(--green);
    }
    &-value {
      font-size: 12px;
      line-height: 15px;
      font-weight: 500;
      color: var(--white-60);
      font-family: "Tektur", sans-serif;
    }
    &-line {
      width: 100%;
      height: 8px;
      background: #31383f;
      position: relative;
      &-current {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(90deg, #d46c2b 16.64%, #ebb642 100%);
      }
    }
  }
  &__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 60px;
    position: relative;
    &-decor {
      position: absolute;
      width: 12px;
      height: 12px;
      &--top-left {
        background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 11V1H11' stroke='white' stroke-linecap='round'/%3E%3C/svg%3E%0A");
        top: 27px;
        left: 32px;
      }
      &--top-right {
        background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 11V1H1' stroke='white' stroke-linecap='round'/%3E%3C/svg%3E%0A");
        top: 27px;
        right: 32px;
      }
      &--bottom-left {
        background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1V11H11' stroke='white' stroke-linecap='round'/%3E%3C/svg%3E%0A");
        bottom: 24px;
        left: 32px;
      }
      &--bottom-right {
        background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 1V11H1' stroke='white' stroke-linecap='round'/%3E%3C/svg%3E%0A");
        bottom: 24px;
        right: 32px;
      }
    }
  }
  &__bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: relative;
    z-index: 3;
  }
  &__feedback {
    cursor: pointer;
    transition: opacity var(--time);
    display: flex;
    &:hover {
      opacity: 0.8;
    }
  }
  &__image {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    max-width: 550px;
  }
  &__inspection {
    position: relative;
    cursor: pointer;
    &-wrap {
      padding: 14px 22px 14px 12px;
      background: rgba(12, 26, 34, 0.6);
      border: 1px solid var(--gray);
      display: flex;
      align-items: center;
      gap: 5px;
      clip-path: polygon(
        10px 0,
        100% 0,
        100% calc(100% - 10px),
        calc(100% - 10px) 100%,
        0 100%,
        0 10px
      );
    }
    &-title {
      font-size: 12px;
      line-height: 110%;
      font-weight: 500;
      color: var(--white);
      font-family: "Tektur", sans-serif;
    }
    &-text {
      font-size: 10px;
      line-height: 12px;
      color: var(--white-60);
      font-weight: 600;
    }
    &-count {
      font-size: 24px;
      line-height: 29px;
      color: #3d484e;
      position: absolute;
      top: -37px;
      right: 38px;
      font-family: "Inter", sans-serif;
    }
    &-decor {
      position: absolute;
      width: 12px;
      height: 12px;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 11V1H1' stroke='%235A6A75' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
      top: -10px;
      right: -10px;
      z-index: 2;
    }
    &::before {
      position: absolute;
      content: "";
      width: 13.8px;
      height: 1px;
      right: -1.9px;
      transform: rotate(-45deg);
      background: var(--gray);
      bottom: 4.7px;
      z-index: 2;
      transition: background var(--time);
    }
    &::after {
      position: absolute;
      content: "";
      width: 13.8px;
      height: 1px;
      left: -1.9px;
      transform: rotate(-45deg);
      background: var(--gray);
      top: 4.7px;
      z-index: 2;
      transition: background var(--time);
    }
  }
  &__skills {
    display: flex;
    gap: 11px;
    &-tag {
      position: absolute;
      padding: 4px 10px;
      background: #e24843;
      font-size: 12px;
      line-height: 14px;
      font-weight: 500;
      color: var(--white);
      width: fit-content;
      top: -12px;
      right: -12px;
      z-index: 3;
    }
    &-item {
      position: relative;
      cursor: pointer;
      transition: opacity var(--time);
      &-wrap {
        min-width: 138px;
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 8px;
        background: rgba(12, 26, 34, 0.6);
        backdrop-filter: blur(4px);
        border: 1px solid var(--green);
      }
      &:first-child {
        & .result__skills-item-wrap {
          clip-path: polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
          );
        }
        &::before {
          position: absolute;
          content: "";
          width: 13.8px;
          height: 1px;
          right: -1.9px;
          transform: rotate(-45deg);
          background: var(--green);
          bottom: 4.7px;
          z-index: 2;
          transition: background var(--time);
        }
        &::after {
          position: absolute;
          content: "";
          width: 13.8px;
          height: 1px;
          left: -1.9px;
          transform: rotate(-45deg);
          background: var(--green);
          top: 4.7px;
          z-index: 2;
          transition: background var(--time);
        }
      }
      &:last-child {
        & .result__skills-item-wrap {
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        &::before {
          position: absolute;
          content: "";
          width: 13.8px;
          height: 1px;
          right: -1.9px;
          transform: rotate(45deg);
          background: var(--green);
          top: 4.7px;
          z-index: 2;
          transition: background var(--time);
        }
        &::after {
          position: absolute;
          content: "";
          width: 13.8px;
          height: 1px;
          left: -1.9px;
          transform: rotate(45deg);
          background: var(--green);
          bottom: 4.7px;
          z-index: 2;
          transition: background var(--time);
        }
      }
      &:hover {
        opacity: 0.8;
      }
    }
    &-text {
      font-size: 14px;
      line-height: 110%;
      color: var(--white);
      text-align: center;
      font-weight: 500;
      font-family: "Tektur", sans-serif;
    }
  }
  &__middle {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    &-right {
      margin-top: 31px;
    }
  }
  &__sinhro {
    width: 403.5px;
    height: 234.5px;
    position: relative;
    margin-top: 35px;
    &::after {
      position: absolute;
      content: "";
      width: 29px;
      height: 29px;
      background-image: url("data:image/svg+xml,%3Csvg width='29' height='29' viewBox='0 0 29 29' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_199_2749)'%3E%3Crect width='20' height='20' transform='translate(0 14.1426) rotate(-45)' fill='%23E24843'/%3E%3Cpath d='M14.5051 17.6893V17.1438C14.5051 16.7532 14.5859 16.3963 14.7475 16.073C14.9125 15.7464 15.1516 15.4854 15.4648 15.2901C15.7813 15.0914 16.1635 14.9921 16.6114 14.9921C17.0693 14.9921 17.4532 15.0898 17.763 15.2851C18.0728 15.4804 18.3068 15.7413 18.4651 16.068C18.6267 16.3946 18.7075 16.7532 18.7075 17.1438V17.6893C18.7075 18.0799 18.6267 18.4386 18.4651 18.7652C18.3034 19.0885 18.066 19.3494 17.7529 19.5481C17.4431 19.7434 17.0626 19.841 16.6114 19.841C16.1568 19.841 15.7729 19.7434 15.4597 19.5481C15.1466 19.3494 14.9092 19.0885 14.7475 18.7652C14.5859 18.4386 14.5051 18.0799 14.5051 17.6893ZM15.682 17.1438V17.6893C15.682 17.9789 15.751 18.2416 15.8891 18.4773C16.0271 18.713 16.2679 18.8309 16.6114 18.8309C16.9515 18.8309 17.1888 18.713 17.3235 18.4773C17.4582 18.2416 17.5256 17.9789 17.5256 17.6893V17.1438C17.5256 16.8542 17.4599 16.5916 17.3286 16.3559C17.2006 16.1202 16.9616 16.0023 16.6114 16.0023C16.2746 16.0023 16.0355 16.1202 15.8941 16.3559C15.7527 16.5916 15.682 16.8542 15.682 17.1438ZM9.3026 11.7696V11.2241C9.3026 10.8335 9.38341 10.4749 9.54504 10.1482C9.71004 9.8216 9.94912 9.56063 10.2623 9.36533C10.5788 9.17002 10.961 9.07237 11.4089 9.07237C11.8668 9.07237 12.2507 9.17002 12.5605 9.36533C12.8703 9.56063 13.1043 9.8216 13.2626 10.1482C13.4208 10.4749 13.5 10.8335 13.5 11.2241V11.7696C13.5 12.1602 13.4191 12.5188 13.2575 12.8454C13.0992 13.1687 12.8635 13.4297 12.5504 13.6284C12.2406 13.8237 11.8601 13.9213 11.4089 13.9213C10.9509 13.9213 10.5653 13.8237 10.2522 13.6284C9.94239 13.4297 9.70667 13.1687 9.54504 12.8454C9.38341 12.5188 9.3026 12.1602 9.3026 11.7696ZM10.4845 11.2241V11.7696C10.4845 12.0592 10.5519 12.3218 10.6866 12.5575C10.8246 12.7933 11.0654 12.9111 11.4089 12.9111C11.7456 12.9111 11.9813 12.7933 12.116 12.5575C12.254 12.3218 12.3231 12.0592 12.3231 11.7696V11.2241C12.3231 10.9345 12.2574 10.6718 12.1261 10.4361C11.9948 10.2004 11.7557 10.0826 11.4089 10.0826C11.0721 10.0826 10.833 10.2004 10.6916 10.4361C10.5536 10.6718 10.4845 10.9345 10.4845 11.2241ZM9.78244 19.6289L16.8942 9.28451H18.1014L10.9896 19.6289H9.78244Z' fill='%230C1A22'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_199_2749'%3E%3Crect width='20' height='20' fill='white' transform='translate(0 14.1426) rotate(-45)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
      top: -14px;
      right: -14px;
    }
    &-bg {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    &-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      line-height: 18px;
      font-weight: 600;
      text-transform: uppercase;
      color: #ebb642;
      font-family: "Tektur", sans-serif;
      position: absolute;
      top: 1px;
      left: 13px;
      &::before {
        position: relative;
        content: "";
        width: 8px;
        height: 14px;
        flex-shrink: 0;
        background-image: url("data:image/svg+xml,%3Csvg width='8' height='14' viewBox='0 0 8 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.00098 13L7.00098 7L1.00098 1' stroke='white' stroke-linecap='round'/%3E%3C/svg%3E%0A");
      }
    }
    &-total {
      width: 86px;
      height: 103px;
      position: absolute;
      z-index: 3;
      right: 24px;
      top: 1px;

      padding-top: 8px;
      text-align: center;
      font-size: 39px;
      line-height: 49px;
      font-weight: 500;
      color: #ebb642;
      font-family: "Tektur", sans-serif;
    }
    &-subtitle {
      position: absolute;
      top: 117px;
      left: 19px;
      z-index: 3;
      padding: 6px 12px;
      width: 312px;

      font-size: 10px;
      line-height: 12px;
      font-weight: 600;
      color: var(--white-60);
      &::after {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.2) 62.9%,
          rgba(255, 255, 255, 0) 100%
        );
        opacity: 0.3;
      }
    }
  }
  &__values {
    position: absolute;
    z-index: 3;
    padding-top: 7px;
    top: 154px;
    left: 19px;
    width: 338px;
    &::after {
      position: absolute;
      content: "";
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 0.4);
      opacity: 0.05;
      top: 0;
      left: 0;
    }
    &-title {
      font-size: 12px;
      line-height: 110%;
      font-weight: 500;
      color: var(--white);
      font-family: "Tektur", sans-serif;
    }
    &-wrap {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    &-total {
      font-size: 12px;
      line-height: 15px;
      font-weight: 500;
      font-family: "Tektur", sans-serif;
      color: var(--white-60);
    }
    &-progress {
      width: 95px;
      height: 12px;
      position: relative;
      &-current {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }
  &__worth {
    width: 263px;
    position: absolute;
    top: 45px;
    left: 18px;
    &-item {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M56 14.9998L30 0L4 14.9998V45.0001L30 60L56 45.0001V14.9998ZM4.98113 15.5665V44.4335L30 58.8673L30.316 57.1009C30.5395 55.8518 31.3026 54.7649 32.4016 54.1304L49.8248 44.0712C50.9237 43.4368 52.2466 43.3193 53.4401 43.7504L55.0189 44.4335V15.5665L30 1.13269L29.684 2.89905C29.4605 4.14817 28.6974 5.2351 27.5984 5.86957L10.1752 15.9288C9.07626 16.5632 7.75339 16.6806 6.55987 16.2496L4.98113 15.5665Z' fill='white'/%3E%3Cpath d='M4.98113 44.4335V15.5665L6.55987 16.2496C7.75339 16.6806 9.07626 16.5632 10.1752 15.9288L27.5984 5.86957C28.6974 5.2351 29.4605 4.14817 29.684 2.89905L30 1.13269L55.0189 15.5665V44.4335L53.4401 43.7504C52.2466 43.3193 50.9237 43.4368 49.8248 44.0712L32.4016 54.1304C31.3026 54.7649 30.5395 55.8518 30.316 57.1009L30 58.8673L4.98113 44.4335Z' fill='%230C1A22' fill-opacity='0.6'/%3E%3C/svg%3E%0A");
      transition: background-image var(--time);
      & svg {
        fill: var(--white);
      }
      & span {
        display: flex;
      }
    }
    &-next {
      position: absolute;
      z-index: 6;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      cursor: pointer;
      mask-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6.5L2 8L4 9.5V6.5Z' fill='%2326E897'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M13.3857 8.64335L14.4575 8.00023L13.3857 7.35711L3.99978 1.72559V3.47487L11.542 8.00023L3.99978 12.5256V14.2749L13.3857 8.64335Z' fill='%2326E897'/%3E%3C/svg%3E%0A");
      background-color: var(--green);
      transition: opacity var(--time);
      &:hover {
        opacity: 0.8;
      }
    }
    & img {
      position: relative;
      z-index: 2;
    }
    & .swiper-slide-active {
      & .result__worth-item {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M56 14.9998L30 0L4 14.9998V45.0002L30 60L56 45.0002V14.9998ZM4.98113 15.5665V44.4335L30 58.8673L30.316 57.1009C30.5395 55.8518 31.3026 54.7649 32.4016 54.1304L49.8248 44.0712C50.9237 43.4368 52.2466 43.3194 53.4401 43.7504L55.0189 44.4335V15.5665L30 1.13269L29.684 2.89905C29.4605 4.14817 28.6974 5.2351 27.5984 5.86957L10.1752 15.9288C9.07626 16.5632 7.75339 16.6806 6.55987 16.2496L4.98113 15.5665Z' fill='%2327F4F8'/%3E%3Cpath d='M4.98113 44.4335V15.5665L6.55987 16.2496C7.75339 16.6806 9.07626 16.5632 10.1752 15.9288L27.5984 5.86957C28.6974 5.2351 29.4605 4.14817 29.684 2.89905L30 1.13269L55.0189 15.5665V44.4335L53.4401 43.7504C52.2466 43.3194 50.9237 43.4368 49.8248 44.0712L32.4016 54.1304C31.3026 54.7649 30.5395 55.8518 30.316 57.1009L30 58.8673L4.98113 44.4335Z' fill='%23142E3D'/%3E%3Cpath d='M4.98113 44.4335V15.5665L6.55987 16.2496C7.75339 16.6806 9.07626 16.5632 10.1752 15.9288L27.5984 5.86957C28.6974 5.2351 29.4605 4.14817 29.684 2.89905L30 1.13269L55.0189 15.5665V44.4335L53.4401 43.7504C52.2466 43.3194 50.9237 43.4368 49.8248 44.0712L32.4016 54.1304C31.3026 54.7649 30.5395 55.8518 30.316 57.1009L30 58.8673L4.98113 44.4335Z' fill='url(%23paint0_radial_483_320)' fill-opacity='0.2'/%3E%3Cdefs%3E%3CradialGradient id='paint0_radial_483_320' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='translate(30 60) rotate(-177.797) scale(26.0192 56.9582)'%3E%3Cstop stop-color='%2327F4F8'/%3E%3Cstop offset='1' stop-color='%2327F4F8' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E%0A");
      }
    }
    &::after {
      position: absolute;
      content: "";
      width: 52px;
      height: 100%;
      right: 0;
      top: 0;
      background: linear-gradient(
        270deg,
        #0c1a22 36.95%,
        rgba(12, 26, 34, 0.4) 100%
      );
      z-index: 4;
    }
  }
  &__worlds {
    width: 398px;
    height: 488px;
    padding: 56px 0;
    position: relative;
    & .swiper {
      height: 100%;
    }
    & .slider-navigation__btn {
      &--prev {
        top: 0;
        left: 50%;
        transform: translateX(-50%) rotate(90deg);
      }
      &--next {
        bottom: 0;
        top: unset;
        left: 50%;
        transform: translateX(-50%) rotate(90deg);
      }
    }
    & .swiper-slide {
      &:nth-child(odd) {
        & .result__world {
          &-title {
            color: #ec2975;
            &::before {
              background-color: #ec2975;
            }
          }
          &::after {
            background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.5 29.0943L2.5 35L6.55791 33.2609L15.9343 10.7576L11.3768 8.80436L2.5 29.0943Z' fill='%23DD1462' fill-opacity='0.5'/%3E%3Cpath d='M6.78098 6.83471L2.5 5L2.5 16.6198L6.78098 6.83471Z' fill='%23DD1462' fill-opacity='0.2'/%3E%3Cpath d='M20.5303 12.7273L13.1521 30.4348L19.2391 27.8261L24.7727 14.5454L20.5303 12.7273Z' fill='%23DD1462' fill-opacity='0.5'/%3E%3Cpath d='M29.3686 16.5151L25.8333 25L37.5 20L29.3686 16.5151Z' fill='%23EC2975'/%3E%3C/svg%3E%0A");
          }
        }
      }
      &:nth-child(even) {
        & .result__world {
          &-title {
            color: #ebb642;
            &::before {
              background-color: #ebb642;
            }
          }
          &::after {
            background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.5 29.0943L2.5 35L6.55791 33.2609L15.9343 10.7576L11.3768 8.80436L2.5 29.0943Z' fill='%23EBB642' fill-opacity='0.5'/%3E%3Cpath d='M6.78098 6.83471L2.5 5L2.5 16.6198L6.78098 6.83471Z' fill='%23EBB642' fill-opacity='0.2'/%3E%3Cpath d='M20.5303 12.7273L13.1521 30.4348L19.2391 27.8261L24.7727 14.5454L20.5303 12.7273Z' fill='%23EBB642' fill-opacity='0.5'/%3E%3Cpath d='M29.3686 16.5151L25.8333 25L37.5 20L29.3686 16.5151Z' fill='%23EBB642'/%3E%3C/svg%3E%0A");
          }
        }
      }
    }
  }
  &__world {
    width: 100%;
    height: 110px;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    &-title {
      font-size: 14px;
      line-height: 18px;
      font-weight: 700;
      font-family: "Tektur", sans-serif;
      display: flex;
      align-items: center;
      gap: 6px;
      &::before {
        position: relative;
        content: "";
        width: 8px;
        height: 16px;
        flex-shrink: 0;
        mask-image: url("data:image/svg+xml,%3Csvg width='8' height='16' viewBox='0 0 8 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.5 2.13582L6.36396 7.99978L0.5 13.8637L0.5 2.13582Z' stroke='%23EC2975'/%3E%3C/svg%3E%0A");
      }
    }
    &-text {
      max-width: 316px;
      font-size: 18px;
      line-height: 23px;
      color: var(--white);
      font-weight: 600;
      font-family: "Tektur", sans-serif;
      text-transform: uppercase;
    }
    &::after {
      position: absolute;
      content: "";
      width: 40px;
      height: 40px;
      right: 16px;
      top: 47px;
    }
  }
  &__create {
    position: relative;
    &-wrap {
      background: rgba(12, 26, 34, 0.6);
      // background: green;
      padding: 10px 12px 16px;
      border: 1px solid var(--gray);
      clip-path: polygon(
        0 0,
        calc(60% - 30px) 0,
        60% 30px,
        calc(60% + 30px) 30px,
        100% 30px,
        100% calc(100% - 20px),
        calc(100% - 20px) 100%,
        20px 100%,
        0 calc(100% - 20px)
      );
    }
    &-title {
      font-size: 14px;
      line-height: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #ec2975;
      font-family: "Tektur", sans-serif;
      &::before {
        position: relative;
        content: "";
        width: 38px;
        height: 11px;
        flex-shrink: 0;
        background-image: url("data:image/svg+xml,%3Csvg width='38' height='11' viewBox='0 0 38 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 0L14 11H0L7 0Z' fill='%23EC2975'/%3E%3Cpath d='M19 11L26 0H12L19 11Z' fill='%23EC2975'/%3E%3Cpath d='M37.0889 10.5H24.9111L31 0.930664L37.0889 10.5Z' stroke='%23EC2975'/%3E%3C/svg%3E%0A");
      }
    }
    &-subtitle {
      font-size: 18px;
      line-height: 23px;
      max-width: 200px;
      font-weight: 700;
      color: var(--white);
      margin-top: 8px;
      font-family: "Tektur", sans-serif;
    }
    &-text {
      font-size: 14px;
      line-height: 16px;
      font-weight: 600;
      color: var(--white-60);
      margin-top: 8px;
      max-width: 200px;
    }
    &-line {
      position: absolute;
      &--1 {
        width: 42px;
        height: 1px;
        background: var(--gray);
        transform: rotate(45deg);
        left: 206px;
        top: 15px;
        z-index: 3;
      }
      &--2 {
        width: 162.5px;
        height: 1px;
        background: var(--gray);

        left: 241px;
        top: 29px;
        z-index: 3;
      }
    }
    &-image {
      position: absolute;
      bottom: 1px;
      right: 1px;
      z-index: 4;
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

.advantages-modal {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 333;
  background: rgba(6, 32, 47, 0.4);
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--time), visibility var(--time);
  &--active {
    opacity: 1;
    visibility: visible;
  }
  &__wrap {
    max-width: 712px;
    width: 100%;
    position: relative;
    &::before {
      position: absolute;
      content: "";
      width: calc(100% - 4px);
      height: 40px;
      left: 1px;
      bottom: 0;
      z-index: 3;
      backdrop-filter: blur(4px);
      background: linear-gradient(
        180deg,
        rgba(25, 52, 68, 0.01) 50.22%,
        rgba(32, 79, 106, 0) 100%
      );

      backdrop-filter: blur(7.300000190734863px);
    }
  }
  &__top {
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
  &__title {
    text-align: center;
    font-size: 18px;
    line-height: 23px;
    color: var(--white-60);
    font-weight: 600;
    font-family: "Tektur", sans-serif;
    text-transform: uppercase;
  }
  &__content {
    width: 100%;
    padding: 40px 24px;
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
    max-height: 630px;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 40px;
    position: relative;
    &::-webkit-scrollbar {
      width: 2px;
      background: var(--transparent);
    }
    &::-webkit-scrollbar-thumb {
      background: var(--green);
      border-radius: 2px;
      z-index: 999;
    }
    &-wrap {
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 100%;
    }
  }
  &__items {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  &__item {
    position: relative;
    &-wrap {
      padding: 8px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      border: 1px solid var(--gray);
      height: 100%;
      background: rgba(12, 26, 34, 0.6);

      clip-path: polygon(
        0 0,
        calc(100% - 20px) 0,
        100% 20px,
        100% 100%,
        20px 100%,
        0 calc(100% - 20px)
      );
      transition: border var(--time);
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
    &-image {
      flex-shrink: 0;
      background: var(--transparent);
      filter: grayscale(100%);
      transition: filter var(--time), background var(--time);
      width: 80px;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-title {
      flex-grow: 1;
      text-align: center;
      font-size: 18px;
      line-height: 18px;
      font-weight: 700;
      font-family: "Tektur", sans-serif;
      color: var(--gray);
      transition: color var(--time);
      &::first-letter {
        text-transform: uppercase;
      }
    }
    &--active {
      & .advantages-modal__item-wrap {
        border: 1px solid var(--green);
      }
      & .advantages-modal__item-title {
        color: var(--white);
      }
      & .advantages-modal__item-image {
        filter: grayscale(0);
        background: radial-gradient(
          40% 40% at 48.75% 49.38%,
          rgba(39, 244, 248, 0.2) 0%,
          rgba(39, 244, 248, 0) 100%
        );
      }
      &::after {
        background: var(--green);
      }
      &::before {
        background: var(--green);
      }
    }
    &--worth {
      &.advantages-modal__item--active {
        & .advantages-modal__item-image {
          background: radial-gradient(
            40% 40% at 48.75% 49.38%,
            rgba(235, 182, 66, 0.2) 0%,
            rgba(235, 182, 66, 0) 100%
          );
        }
      }
    }
  }
  &__close {
    width: 24px;
    height: 24px;
    position: absolute;
    right: -16px;
    top: -8px;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_547_7312)'%3E%3Cpath d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_547_7312'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
  }
}

.feedback {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 333;
  padding: 100px 0;
  background: rgba(224, 244, 244, 0.2);
  backdrop-filter: blur(65px);
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--time), visibility var(--time);
  &--active {
    opacity: 1;
    visibility: visible;
  }
  &__wrap {
    width: 100%;
    padding: 30px 77px 30px 40px;
    border-top: 1px solid var(--green);
    border-bottom: 1px solid var(--green);
    background: rgba(0, 0, 0, 0.5);
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 47px;
    position: relative;
    overflow-y: auto;
    &::after {
      position: fixed;
      content: "";
      width: 1px;
      height: calc(100% - 280px);
      top: 140px;
      right: 207px;
      background: var(--green);
      opacity: 0.2;
    }
    &::-webkit-scrollbar {
      width: 2px;
      background: var(--transparent);
    }
    &::-webkit-scrollbar-thumb {
      background: var(--green);
      border-radius: 2px;
      z-index: 999;
    }
  }
  &__top {
    display: flex;
    align-items: center;
    gap: 230px;
  }
  &__back {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 20px;
    line-height: 25px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    text-transform: uppercase;
    font-family: "Tektur", sans-serif;
    &::before {
      position: relative;
      content: "";
      width: 36px;
      height: 32px;
      flex-shrink: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='36' height='32' viewBox='0 0 36 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.2' d='M34.9393 15.9708H0.998187M0.998187 15.9708L16.0831 0.885898M0.998187 15.9708L16.0831 31.0558' stroke='white' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
    }
  }
  &__title {
    font-size: 32px;
    line-height: 40px;
    color: var(--white);
    font-family: "Tektur", sans-serif;
    color: var(--white);
    font-weight: 600;
  }
  &__content {
    display: flex;
    flex-grow: 1;
  }
  &__items {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  &__item {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    justify-content: space-between;
    &-wrap {
      display: flex;
      align-items: flex-end;
      gap: 16px;
    }
    &-image {
      width: 80px;
      height: 80px;
      border-radius: 3px;
      border: 1px solid #eaa53d;
      overflow: hidden;
      & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &-title {
      font-size: 20px;
      line-height: 26px;
      color: var(--white);
      max-width: 445px;
      font-family: "Tektur", sans-serif;
    }
    &-social {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--green);
      cursor: pointer;
    }
  }
}
</style>
