<script setup lang="ts">
import Map from "@/components/Map.vue";
</script>
<template>
  <div class="w-screen h-screen">
    <h1>holi</h1>
    <client-only>
      <Map />
    </client-only>
  </div>
</template>
