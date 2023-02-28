import { defineNuxtConfig } from "nuxt/config";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

const isDev = process.env.NODE_ENV === "development";

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/supabase",
    "nuxt-windicss",
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: [["defineStore", "definePiniaStore"]],
      },
    ],
  ],
  typescript: {
    strict: true,
  },
  css: [
    "virtual:windi-base.css",
    "virtual:windi-components.css",
    "virtual:windi-utilities.css",
    "leaflet/dist/leaflet.css",
    "@/assets/styles/main.less",
  ],
  build: {
    transpile: [...(isDev ? [] : ["@babel/runtime"]), "lodash-es"],
  },
  vite: {
    plugins: [
      Components({
        /**
         * {resolveIcons: true}: resolving problem with icons
         * {importStyle: false}: do not import css, do it manually for dark mode
         */
        resolvers: [
          AntDesignVueResolver({
            cjs: false,
            importStyle: "less",
            resolveIcons: true,
          }),
        ],
        dirs: ["node_modules/@ant-design/icons-vue/es"],
        extensions: ["vue", "js"],
        dts: "components.d.ts",
      }),
    ],
    ssr: {
      noExternal: [/vue-i18n/, "ant-design-vue", "@ant-design/icons-vue"],
    },
    css: {
      preprocessorOptions: {
        less: {
          // additionalData: '@import "ant-design-vue/dist/antd.dark.less";',
          javascriptEnabled: true,
        },
      },
    },
  },
  experimental: {
    reactivityTransform: true,
  },
  runtimeConfig: {
    public: {
      AVATAR_STORAGE_URL: process.env.SUPASE_AVATAR_STORAGE_URL,
    },
  },
  routeRules: {
    "/map/**": { ssr: false },
    "/register": { ssr: false },
  },
});
