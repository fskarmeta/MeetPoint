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
  app: {
    head: {
      title: "MeetPoint - Find the Perfect Meeting Point with Friends",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "With MeetPoint, you can easily coordinate meetups with your friends in the city. Simply add everyone's location on the map and let MeetPoint find the ideal meeting point between you all. Say goodbye to the hassle of figuring out where to meet and enjoy more time with your friends instead. Download MeetPoint today and start planning your next get-together!",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
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
