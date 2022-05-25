<template>
  <nav class="f-toolbar">
    <v-toolbar dense flat color="#f4f4f4" height="32px">
      <router-link to="/brands">
        <a href="#" class="text-uppercase option">{{$t('home.link1')}}</a>
      </router-link>
      <a class="text-uppercase option">|</a>
      <router-link to="/buyers">
        <a href="#" class="text-uppercase option">{{$t('home.link2')}}</a>
      </router-link>
      <a class="text-uppercase option">|</a>
      <router-link to="/buyers">
        <a href="#" class="text-uppercase option">{{$t('home.link3')}}</a>
      </router-link>

      <v-spacer></v-spacer>
      <v-icon small color="#666">mdi-account-outline</v-icon>
      <template v-if="!isLoggedIn">
        <router-link to="/login">
          <a href class="text-uppercase option ml-1">{{$t('home.login')}}</a>
        </router-link>
        <a class="text-uppercase option">|</a>
        <router-link to="/register">
          <a href class="text-uppercase option">{{$t('home.register')}}</a>
        </router-link>
      </template>
      <template v-if="isLoggedIn">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text tile small color="#666" v-bind="attrs" v-on="on">
              {{ getProfile.userName }}
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group v-model="userOptions">
              <v-list-item v-for="(option, i) in userOptions" :key="i">
                <v-list-item-icon class="mr-4">
                  <v-icon v-text="option.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content class="mr-2">
                  <v-list-item-title>{{ option.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <v-divider></v-divider>
            <v-list-item-group>
              <v-list-item @click="handleLogout">
                <v-list-item-icon class="mr-4">
                  <v-icon>mdi-logout-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="mr-2">
                  <v-list-item-title>{{$t('home.logout')}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </template>

       <a class="text-uppercase option">|</a>

      <v-col class="lang-select">
        <v-select dense color="#666" flat  v-model="lang" :items="langArray" single-line hide-details return-object>
      </v-select>

      </v-col>
    </v-toolbar>
  </nav>
</template>

<script>
import { languages } from '@/plugins/i18n'
export default {
  name: 'NavBar',
  data() {
    return {
      langArray: languages,
      userOptions: [
        {
          icon: 'mdi-account-heart-outline',
          link: '/user/information',
          title: 'Manage Profile',
        },
        {
          icon: 'mdi-dolly',
          link: '/addresslist',
          title: 'My Addresses',
        },
        {
          icon: 'mdi-basket-outline',
          link: '/orderlist',
          title: 'My Orders',
        },
        {
          icon: 'mdi-ticket-percent-outline',
          link: '/user/coupon',
          title: 'My Coupons',
        },
      ],
    };
  },

  computed: {
    lang: {
      get: function() {
        return this.$store.state.locale
      },
      set: function(newVal) {
        this.$store.dispatch('changeLocale', newVal)
      }
    },
    isLoggedIn() {
      return this.$store.getters['isLoggedIn'];
    },
    getProfile() {
      return this.$store.getters['getProfile'];
    },
  },

  methods: {
    handleLogout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({ path: '/login' });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.lang-select {
  max-width: 100px;
  & > .v-select {
    font-size: 12px ;
    color: #666;
    ::v-deep .v-input__slot:before  {
      border-style: none;
    }
  }
}


.f-toolbar {
  box-sizing: border-box;
  width: 100%;
  color:#666;
  font-size: 12px;
  vertical-align: baseline;
  margin: 0;
  padding: 0;
}

.option {
  color: #666;
  margin-right: 10px;
}

</style>
