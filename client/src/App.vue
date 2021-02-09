<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <one-footer></one-footer>
  </v-app>
</template>

<script>
import Footer from '@/components/Footer.vue';
export default {
  components: { 'one-footer': Footer },
  data() {
    return {
      //empty
    };
  },
  created() {
    //when page refresh, keep vuex data into local storage
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('storedState', JSON.stringify(this.$store.state));
    });
    //when page loading, read data from local storage
    if (localStorage.getItem('storedState')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(localStorage.getItem('storedState'))));
      // localStorage.removeItem("storedState");
    }
  },
};
</script>

<style></style>
