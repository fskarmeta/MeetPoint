<script setup lang="ts">
import FormRegister from "~~/components/form/Register.client.vue";
definePageMeta({
  middleware: "register-auth",
});
</script>

<template>
  <div class="place-self-center">
    <FormRegister />
  </div>
</template>
