<script setup lang="ts">
import backgroundImage from "../assets/images/vintage-map.jpg";
</script>

<template>
  <div class="w-screen h-screen relative overflow-hidden">
    <img
      class="w-screen h-screen absolute opacity-20"
      :src="backgroundImage"
      alt="background-image"
    />

    <div class="mx-auto h-full flex justify-center relative">
      <slot />
    </div>
  </div>
</template>
