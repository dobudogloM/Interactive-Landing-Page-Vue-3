<script setup lang="ts">
import DecorTitle from "@/components/uikit/DecorTitle.vue";
import UserPoints from "@/components/uikit/UserPoints.vue";
import GreenButton from "@/components/uikit/GreenButton.vue";
import PageLoader from "@/components/uikit/PageLoader.vue";
import { useGameStore } from "@/stores/index";
import { useRouter } from "vue-router";
import { onMounted, ref, watch, computed } from "vue";
import { getImagePath } from "@/utils/image";

const store = useGameStore();
const router = useRouter();
const gender = ref("male");
const activeRole = ref(store.rolesList.length > 0 ? store.rolesList[0].id : 0);
const isImageLoading = ref(true);

// Выбор роли
const selectRole = async () => {
  await store.selectRole(gender.value, activeRole.value);

  router.push("/grade");
};

// Главное изображение выбранной роли
const selectedRoleImage = computed(() => {
  const role = store.rolesList.find((r) => r.id === activeRole.value);
  if (!role) return "";

  const img = role.images.find((img) => img.gender === gender.value);
  return img ? getImagePath(img.path) : "";
});

// Загрузка изображения
const handleImageLoad = () => {
  isImageLoading.value = false;
};

watch(
  () => store.rolesList,
  (newRoles) => {
    if (newRoles.length > 0) {
      activeRole.value = newRoles[0].id;
    }
  },
  { immediate: true }
);

watch(selectedRoleImage, () => {
  isImageLoading.value = true;
});

onMounted(() => {
  store.getRole();
});
</script>

<template>
  <section class="role">
    <div class="role__bg"><img src="/images/role-bg.jpg" alt="" /></div>
    <div class="role__top">
      <DecorTitle
        :title="'Кто ты в команде?'"
        :icon="'/images/role-icon-top.svg'"
      />
      <UserPoints :count1="store.playerScore" />
    </div>
    <div class="role__content">
      <div class="role__cards">
        <div
          class="role__card"
          v-for="(item, i) in store.rolesList"
          :key="i"
          :class="{ 'role__card--active': activeRole === item.id }"
          @click="activeRole = item.id"
        >
          <div class="role__card-wrap">
            <div class="role__card-title">
              {{ item.description }}
            </div>
            <div
              v-for="(image, j) in item.images"
              :key="j"
              class="role__card-image"
            >
              <img
                v-if="image.gender == gender"
                :src="getImagePath(image.path)"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div class="role__image">
        <PageLoader
          class="loader--image"
          :class="{ 'loader--active': isImageLoading }"
        />
        <img
          v-show="!isImageLoading"
          :src="selectedRoleImage"
          alt=""
          @load="handleImageLoad"
        />
      </div>
    </div>
    <div class="role__bottom">
      <div class="role__bottom-items">
        <div class="role__bottom-item">
          <div class="role__bottom-title">роль</div>
          <div class="h2">
            {{
              store.rolesList.find((role) => role.id === activeRole)?.name ?? ""
            }}
          </div>
        </div>
        <div class="role__bottom-item">
          <div class="role__bottom-title">пол</div>
          <div class="role__gender">
            <div
              class="role__gender-item"
              :class="{ 'role__gender-item--active': gender === 'male' }"
              @click="gender = 'male'"
            >
              <div class="role__gender-wrap">он</div>
            </div>
            <div
              class="role__gender-item"
              :class="{ 'role__gender-item--active': gender === 'female' }"
              @click="gender = 'female'"
            >
              <div class="role__gender-wrap">она</div>
            </div>
          </div>
        </div>
      </div>
      <GreenButton @click="selectRole">Далее</GreenButton>
    </div>
  </section>
</template>

<style lang="scss">
.role {
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px 60px 0;
  }
  &__gender {
    display: flex;
    align-items: center;
    gap: 24px;
    &-item {
      position: relative;
      &::before {
        position: absolute;
        content: "";
        width: 13.8px;
        height: 1px;
        right: -1.9px;
        transform: rotate(45deg);
        background: var(--gray);
        top: 4.7px;
        z-index: 2;
        transition: background var(--time);
      }
      &--active {
        & .role__gender-wrap {
          border: 1px solid var(--green);
          color: var(--green);
        }
        &::before {
          background: var(--green);
        }
      }
    }
    &-wrap {
      width: 84px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 18px;
      line-height: 23px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--white-80);
      background: var(--black);
      border: 1px solid var(--gray);
      cursor: pointer;
      transition: border var(--time), color var(--time);
      clip-path: polygon(
        0 0,
        calc(100% - 10px) 0,
        100% 10px,
        100% 100%,
        0 100%
      );
    }
  }
  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 60px 20px;
    &-items {
      display: flex;
      align-items: flex-start;
      gap: 80px;
    }
    &-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    &-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      line-height: 26px;
      color: var(--green);
      font-family: "Tektur", sans-serif;
      &::before {
        position: relative;
        content: "";
        background-color: var(--green);
        mask-image: url("data:image/svg+xml,%3Csvg width='8' height='16' viewBox='0 0 8 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.5 2.13582L6.36396 7.99978L0.5 13.8637L0.5 2.13582Z' stroke='%2300F89A'/%3E%3C/svg%3E%0A");
        width: 8px;
        height: 16px;
        flex-shrink: 0;
      }
    }
    &-position {
      font-size: 40px;
      line-height: 52px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--white);
    }
    & .btn {
      margin-right: 7%;
    }
  }
  &__content {
    flex-grow: 1;
    margin-top: 32px;

    padding: 0 60px;
  }
  &__cards {
    max-width: 816px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  &__card {
    position: relative;
    cursor: pointer;

    &-wrap {
      padding: 24px;
      min-height: 200px;
      display: flex;
      position: relative;
      flex-direction: column;
      justify-content: flex-end;
      border: 1px solid var(--gray);
      overflow: hidden;
      background: rgba(12, 26, 34, 0.6);
      height: 100%;
      clip-path: polygon(
        0 0,
        calc(100% - 20px) 0,
        100% 20px,
        100% 100%,
        20px 100%,
        0 calc(100% - 20px)
      );
      transition: border var(--time), background var(--time);
      &::after {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 0;
        background: radial-gradient(
          100% 189.95% at 0% 100%,
          rgba(39, 244, 248, 0.2) 0%,
          rgba(39, 244, 248, 0) 50%
        );
        opacity: 0;
        visibility: hidden;
        transition: opacity var(--time), visibility var(--time);
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
    &-title {
      font-size: 16px;
      line-height: 21px;
      font-weight: 600;
      color: var(--white-80);
      font-family: "Tektur", sans-serif;
      position: relative;
      z-index: 2;
      transition: color var(--time);
    }
    &-image {
      position: absolute;
      max-width: 40%;
      right: 10%;
      bottom: -10%;
      filter: grayscale(100%);
      opacity: 0.2;
      transform: rotateY(-180deg);
    }
    &--active {
      &::after {
        background: var(--green);
      }
      &::before {
        background: var(--green);
      }
      & .role__card-title {
        color: var(--green);
      }
      & .role__card-wrap {
        border: 1px solid var(--green);
        background: linear-gradient(
          0deg,
          var(--Background-Button-Secondary-active, #0c1a22),
          var(--Background-Button-Secondary-active, #0c1a22)
        );

        &::after {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }
  &__image {
    position: absolute;
    right: 0;
    width: 35%;
    min-height: 1000px;
    height: auto;
    bottom: -10px;
    filter: grayscale(100%);
    display: flex;
    align-items: flex-end;
    & img {
      width: 100%;
      height: 100%;
    }
  }
  & .h2  {
    font-size: 24px;
    line-height: 48px;
  }
}

@media (max-width: 1380px) {
  .role {
    &__image {
      width: 30%;
      min-height: 400px;
    }
    &__bottom {
      padding: 0 60px 40px;
      & .btn {
        margin-right: 0;
      }
    }
  }
}

@media (min-width: 1921px) {
  .role {
    &__cards {
      max-width: 60%;
    }
    &__card {
      &-wrap {
        min-height: 300px;
        height: auto;
      }
      &-image {
        bottom: unset;
        top: 10%;
      }
    }
    &__image {
      max-width: 756px;
      min-height: 600px;
      width: 100%;
    }
    &__bottom {
      padding: 0 60px 90px;
    }
    & .h2 {
      font-size: 40px;
      line-height: 100%;  
    }
  }
}
</style>
