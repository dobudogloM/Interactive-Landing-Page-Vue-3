<script setup lang="ts"></script>

<template>
  <div class="loader">
    <svg
      class="hexagon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 129.78 150.37"
    >
      <!-- Градиент для затухания -->
      <defs>
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="50%" stop-color="white" stop-opacity="0.5" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Путь для анимации -->
      <path
        class="hexagon-line-animation"
        d="M64.9519052838329 0L129.9038105676658 37.5L129.9038105676658 112.5L64.9519052838329 150L0 112.5L0 37.5Z"
      />
    </svg>
  </div>
</template>

<style lang="scss">
.loader {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1111;
  background: rgba(6, 32, 47, 0.4);
  backdrop-filter: blur(24px);
  opacity: 0;
  visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  &--active {
    opacity: 1;
    visibility: visible;
  }
  &--image {
    background: var(--transparent);
    backdrop-filter: none;
  }
}

.hexagon {
  height: 60px;
  overflow: visible;
}

.hexagon-base,
.hexagon-line-animation {
  fill: var(--transparent);
  stroke-miterlimit: 10;
  stroke-width: 10px;
}

.hexagon-base {
  stroke: var(--transparent);
}

.hexagon-line-animation {
  stroke: url(#line-gradient); /* Применяем градиент для затухания по всей линии */
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: dash 2s linear infinite;
}

/* Анимация для движения линии */
@keyframes dash {
  0% {
    stroke-dasharray: 260.22 173.48;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 1 431.7;
  }

  100% {
    stroke-dasharray: 260.22 173.48;
    stroke-dashoffset: -867.4;
  }
}
</style>
