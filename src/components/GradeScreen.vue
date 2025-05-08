<script setup lang="ts">
import DecorTitle from "@/components/uikit/DecorTitle.vue";
import UserPoints from "@/components/uikit/UserPoints.vue";
import GreenButton from "@/components/uikit/GreenButton.vue";
import InlineSvg from "@/components/uikit/InlineSvg.vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/index";
import { onMounted, ref } from "vue";
import { getImagePath } from "@/utils/image";

interface Skills {
  id: number;
  name: string;
  icon: string;
}

const store = useGameStore();
const router = useRouter();
const selectedItems = ref<Skills[]>([]);
const maxSelection = 5;

// Переключение активности скиллов
const toggleSelection = (item: Skills) => {
  const index = selectedItems.value.findIndex(
    (selected) => selected.id === item.id
  );

  if (index !== -1) {
    selectedItems.value.splice(index, 1);
  } else if (selectedItems.value.length < maxSelection) {
    selectedItems.value.push(item);
  }
};

// Выбор скиллов
const selectSkills = async () => {
  if (selectedItems.value.length === 5) {
    const ids = selectedItems.value.map((item) => Number(item.id));
    await store.selectSkills(ids);
    router.push("/processing");
  }
};

onMounted(() => {
  store.getSkills();
});
</script>

<template>
  <section class="grade">
    <div class="grade__bg">
      <img src="/images/grade-bg.jpg" alt="" />
    </div>
    <div class="grade__top">
      <DecorTitle
        :title="'ПРОКАЧАЙ СВОЕГО ПЕРСОНАЖА'"
        :icon="'/images/grade-icon-top.svg'"
      />
      <UserPoints :count1="store.playerScore" />
    </div>
    <div class="grade__content">
      <div class="grade__icons">
        <div
          v-for="item in selectedItems"
          :key="item.id"
          class="grade__icon grade__icon--active"
        >
          <InlineSvg :src="'/images/' + item.icon + '.svg'" class="icon" />
        </div>

        <div
          v-for="i in 5 - selectedItems.length"
          :key="'empty-' + i"
          class="grade__icon"
        ></div>
      </div>
      <div class="grade__image">
        <img
          :src="
            getImagePath(store.playerInfoArray?.selectedCharacter?.imagePath)
          "
          alt=""
        />
        <GreenButton v-if="selectedItems.length === 5" @click="selectSkills"
          >Завершить</GreenButton
        >
      </div>
      <div class="grade__softs">
        <div class="grade__softs-top">
          <div class="grade__softs-top-wrap">Софты</div>
        </div>
        <div class="grade__softs-content">
          <div
            class="grade__item"
            v-for="(item, i) in store.skillsList"
            :key="i"
            :class="{
              'grade__item--active': selectedItems.some(
                (selected) => selected.id === item.id
              ),
            }"
            @click="toggleSelection(item)"
          >
            <div class="grade__item-wrap">
              <div class="grade__item-icon">
                <InlineSvg
                  :src="'/images/' + item.icon + '.svg'"
                  class="my-custom-icon"
                />
              </div>
              <div class="grade__item-text">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.grade {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 40px;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px 60px 0;
  }
  &__content {
    flex-grow: 1;
    position: relative;
    padding: 0 60px 90px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    &::after {
      position: absolute;
      content: "";
      width: 100%;
      height: 320px;
      background: radial-gradient(
        99.4% 56.85% at 50% 84.33%,
        #061117 41.84%,
        rgba(0, 0, 0, 0) 100%
      );

      bottom: -30px;
      left: 0;
    }
  }
  &__icons {
    max-width: 192px;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 16px;
    position: relative;
    z-index: 5;
  }
  &__icon {
    width: 88px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("data:image/svg+xml,%3Csvg width='88' height='100' viewBox='0 0 88 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M88 24.9997L44 0L0 24.9997V75.0003L44 100L88 75.0003V24.9997ZM1.66038 25.9442V74.0558L44 98.1122L44.5348 95.1682C44.913 93.0864 46.2044 91.2748 48.0642 90.2174L77.5496 73.452C79.4094 72.3946 81.6481 72.1989 83.6679 72.9173L86.3396 74.0558V25.9442L44 1.88782L43.4652 4.83176C43.087 6.91361 41.7956 8.72516 39.9358 9.78261L10.4504 26.5479C8.59059 27.6054 6.35189 27.8011 4.33209 27.0827L1.66038 25.9442Z' fill='white'/%3E%3Cpath d='M1.66038 74.0558V25.9442L4.33209 27.0827C6.35189 27.8011 8.59059 27.6054 10.4504 26.5479L39.9358 9.78261C41.7956 8.72516 43.087 6.91361 43.4652 4.83176L44 1.88782L86.3396 25.9442V74.0558L83.6679 72.9173C81.6481 72.1989 79.4094 72.3946 77.5496 73.452L48.0642 90.2174C46.2044 91.2748 44.913 93.0864 44.5348 95.1682L44 98.1122L1.66038 74.0558Z' fill='%23111F27' fill-opacity='0.6'/%3E%3C/svg%3E%0A");
    transition: background-image var(--time);
    &:nth-child(even) {
      margin-left: auto;
    }

    & svg {
      fill: var(--white);
      width: 42px;
      height: auto;
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--time), visibility var(--time);
    }
    & span {
      display: flex;
    }
    & img {
      position: relative;
      z-index: 2;
    }
    &--active {
      background-image: url("data:image/svg+xml,%3Csvg width='88' height='100' viewBox='0 0 88 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M88 24.9997L44 0L0 24.9997V75.0003L44 100L88 75.0003V24.9997ZM1.66038 25.9442V74.0558L44 98.1122L44.5348 95.1682C44.913 93.0864 46.2044 91.2748 48.0642 90.2174L77.5496 73.452C79.4094 72.3946 81.6481 72.1989 83.6679 72.9173L86.3396 74.0558V25.9442L44 1.88782L43.4652 4.83176C43.087 6.91361 41.7956 8.72516 39.9358 9.78261L10.4504 26.5479C8.59059 27.6054 6.35189 27.8011 4.33209 27.0827L1.66038 25.9442Z' fill='%2327F4F8'/%3E%3Cpath d='M1.66038 74.0558V25.9442L4.33209 27.0827C6.35189 27.8011 8.59059 27.6054 10.4504 26.5479L39.9358 9.78261C41.7956 8.72516 43.087 6.91361 43.4652 4.83176L44 1.88782L86.3396 25.9442V74.0558L83.6679 72.9173C81.6481 72.1989 79.4094 72.3946 77.5496 73.452L48.0642 90.2174C46.2044 91.2748 44.913 93.0864 44.5348 95.1682L44 98.1122L1.66038 74.0558Z' fill='%23142E3D'/%3E%3Cpath d='M1.66038 74.0558V25.9442L4.33209 27.0827C6.35189 27.8011 8.59059 27.6054 10.4504 26.5479L39.9358 9.78261C41.7956 8.72516 43.087 6.91361 43.4652 4.83176L44 1.88782L86.3396 25.9442V74.0558L83.6679 72.9173C81.6481 72.1989 79.4094 72.3946 77.5496 73.452L48.0642 90.2174C46.2044 91.2748 44.913 93.0864 44.5348 95.1682L44 98.1122L1.66038 74.0558Z' fill='url(%23paint0_radial_481_282)' fill-opacity='0.2'/%3E%3Cdefs%3E%3CradialGradient id='paint0_radial_481_282' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='translate(44 100) rotate(-177.831) scale(44.0316 94.9324)'%3E%3Cstop stop-color='%2327F4F8'/%3E%3Cstop offset='1' stop-color='%2327F4F8' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E%0A");
      & svg {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  &__softs {
    max-width: 648px;
    width: 100%;
    position: relative;
    z-index: 5;
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
      max-height: 512px;
      height: 100%;
      overflow-y: scroll;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
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
    }
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

      backdrop-filter: blur(2px);
    }
  }
  &__item {
    position: relative;
    cursor: pointer;
    transition: opacity var(--time);
    &-wrap {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      border: 1px solid var(--gray);
      height: 100%;
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
    &-text {
      font-size: 16px;
      line-height: 21px;
      font-weight: 600;
      color: var(--white);
      text-transform: uppercase;
      font-family: "Tektur", sans-serif;
      transition: color var(--time);
    }
    &-icon {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      & span {
        display: flex;
      }
      & svg {
        fill: var(--white);
        transition: fill var(--time);
      }
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
    &:hover {
      opacity: 0.8;
    }
    &--active {
      & .grade__item-wrap {
        border: 1px solid var(--green);
      }
      & .grade__item-text {
        color: var(--green);
      }
      & .grade__item-wrap {
        & svg {
          fill: var(--green);
        }
      }
      &::after {
        background: var(--green);
      }
      &::before {
        background: var(--green);
      }
    }
  }
  &__image {
    position: relative;
    max-width: 600px;
    & img {
      filter: grayscale(100%);
    }
    & .btn {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 5;
    }
  }
}
@media (max-width: 1580px) {
  .grade {
    &__image {
      max-width: 460px;
    }
  }
}
@media (min-width: 1921px) {
  .grade {
    &__softs {
      max-width: 800px;
    }
    &__image {
      max-width: 460px;
      width: 100%;
      position: relative;
      bottom: -20px;
      & img {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
