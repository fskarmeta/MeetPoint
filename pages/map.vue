<script setup lang="ts">
import MapClient from "~~/components/Map.client.vue";

definePageMeta({
  layout: "map",
});
</script>
<template>
  <div class="w-screen h-full">
    <MapClient />
  </div>
</template>
