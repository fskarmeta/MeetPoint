<script setup lang="ts">
definePageMeta({
  pageTransition: false,
  layout: "redirect",
});

onMounted(() => {
  setTimeout(() => {
    window.location.href = window.location.origin + "/register";
  }, 500);
});
</script>
<template>
  <div class="w-screen h-full">...</div>
</template>
