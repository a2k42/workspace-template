// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: "Nuxt Pinia Template"
        }
    },
    css: ["~/assets/css/main.css", "vue-ui/style.css"],
    devServer: {
        port: +(process.env.PORT || 3000),
    },
    devtools: { enabled: true },
    telemetry: false,
});
