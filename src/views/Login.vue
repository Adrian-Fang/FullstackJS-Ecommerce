<template>
  <div>
    <NavBar />
    <Header />
    <div class="container">
      <v-card width="400" class="mx-auto mt-5">
        <v-card-title>Email Login</v-card-title>
        <v-card-text>
          <v-form ref="loginForm" v-model="valid" lazy-validation>
            <v-text-field
              label="Email"
              prepend-icon="mdi-email-open"
              v-model="loginForm.userId"
              :rules="emailRules"
            ></v-text-field>
            <v-text-field
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              v-model="loginForm.userPwd"
              :rules="passwordRules"
              @keyup.enter="handleLogin"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-row justify="space-between" align="center" class="mx-4 my-0">
          <v-checkbox dense label="Remember me" v-model="rememberAccount" width="200px"></v-checkbox>
          <a>Forgot password?</a>
        </v-row>

        <v-card-actions class="ml-3">
          <v-btn color="primary" @click="handleLogin">Login</v-btn>
          <v-btn color="accent" @click="reset">Reset</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Header from '@/components/Header.vue';
import axios from 'axios';
export default {
  components: { NavBar, Header },
  data() {
    return {
      showPassword: false,
      valid: false,
      rememberAccount: false,
      loginForm: {
        userId: '',
        userPwd: '',
      },
      emailRules: [(v) => !!v || 'Email is required', (v) => /.+@.+/.test(v) || 'Seems like unvalid email address'],
      passwordRules: [(v) => !!v || 'Password is required', (v) => v.length >= 6 || 'Please input valid password'],
    };
  },
  methods: {
    handleLogin() {
      if (this.valid) {
        // Default Vuetify form validation
        this.$store.dispatch('login', this.loginForm).then(() => {
          this.$router.push('/mall');
          this.$store.dispatch('getCartList');
        });
        // this.$store.dispatch("getCartList").then(() => {
        //   console.log("cart initialized...");
        // });
      }
    },
    reset() {
      this.$refs.loginForm.reset();
      this.$refs.loginForm.resetValidation();
    },
  },
};
</script>

<style scoped>
.options {
  display: flex;
  flex-direction: row;
}
</style>
