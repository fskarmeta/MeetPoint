<script setup lang="ts"></script>
<template>
  <div
    class="flex flex-col w-full h-full justify-content-center place-items-center"
  >
    <h1>
      A simple application that allows you to find point X distant between
      people on a map.
    </h1>
    <div>
      <AButton type="primary" @click="$router.push('/map')"
        >Go the the map</AButton
      >
    </div>
  </div>
</template>
