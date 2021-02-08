<template>
  <nav class="f-toolbar">
    <v-toolbar dense flat color="#f4f4f4" height="32px">
      <router-link to="/brands">
        <a href="#" class="text-uppercase option">Brands</a>
      </router-link>
      <a class="text-uppercase option">|</a>
      <router-link to="/buyers">
        <a href="#" class="text-uppercase option">Buyers</a>
      </router-link>
      <a class="text-uppercase option">|</a>
      <router-link to="/buyers">
        <a href="#" class="text-uppercase option">Featured</a>
      </router-link>

      <v-spacer></v-spacer>
      <v-icon small color="#666">mdi-account-outline</v-icon>
      <template v-if="!isLoggedIn">
        <router-link to="/login">
          <a href class="text-uppercase option ml-1">login</a>
        </router-link>
        <a class="text-uppercase option">|</a>
        <router-link to="/register">
          <a href class="text-uppercase option">Register</a>
        </router-link>
      </template>
      <template v-if="isLoggedIn">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text tile small color="#666" v-bind="attrs" v-on="on">
              {{getProfile.userName}}
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group v-model="userOptions">
              <v-list-item v-for="(option,i) in userOptions" :key="i">
                <v-list-item-icon class="mr-4">
                  <v-icon v-text="option.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content class="mr-2">
                  <v-list-item-title>{{option.title}}</v-list-item-title>
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
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </template>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn tile text small color="#666" v-bind="attrs" v-on="on">{{lang}}</v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(lang, index) in langs" :key="index">
            <v-list-item-title>{{ lang.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      lang: "English",
      langs: [
        { text: "English", active: 1 },
        { text: "中文简体", active: 0 },
        { text: "Français", active: 0 },
      ],
      userOptions: [
        {
          icon: "mdi-account-heart-outline",
          link: "/user/information",
          title: "Manage Profile",
        },
        {
          icon: "mdi-dolly",
          link: "/addresslist",
          title: "My Addresses",
        },
        {
          icon: "mdi-basket-outline",
          link: "/orderlist",
          title: "My Orders",
        },
        {
          icon: "mdi-ticket-percent-outline",
          link: "/user/coupon",
          title: "My Coupons",
        },
      ],
    };
  },
  mounted() {
    this.lang = this.langs.filter((lang) => lang.active == 1)[0].text;
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters["isLoggedIn"];
    },
    getProfile() {
      return this.$store.getters["getProfile"];
    },
  },

  methods: {
    handleLogout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push({ path: "/login" });
      });
    },
  },
};
</script>


<style scoped>
a {
  text-decoration: none;
}
.f-toolbar {
  box-sizing: border-box;
  width: 100%;
  color: #666;
  font-size: 12px;
  vertical-align: baseline;
  margin: 0;
  padding: 0;
}

.option {
  color: #666;
  margin-right: 10px;
}
</style>>