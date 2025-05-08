<script setup lang="ts">
import router from "@/router";
import { onMounted } from "vue";

onMounted(() => {
  const video = document.getElementById("bg-video") as HTMLVideoElement;
  if (video) {
    video.addEventListener("ended", () => {
      router.push("/result");
    });
  }
});
</script>

<template>
  <section class="identification">
    <div class="identification__bg">
      <video
        id="bg-video"
        src="/videos/processing.mp4"
        autoplay
        muted
        playsinline
      ></video>
    </div>
  </section>
</template>

<style lang="scss">
.identification {
  width: 100vw;
  height: 100vh;
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
    & video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
