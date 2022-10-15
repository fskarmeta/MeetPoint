// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/supabase", "nuxt-windicss"],
  css: [
    "virtual:windi-base.css",
    "virtual:windi-components.css",
    "virtual:windi-utilities.css",
    "leaflet/dist/leaflet.css",
  ],
});
