import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.pink.darken1, // #D81B60
                secondary: colors.pink.lighten4, // ##F8BBD0
                accent: colors.grey.lighten1, // #
            },
        },
    },
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    }
})