<template>
  <div>
    <v-footer dark
              padless>
      <v-card width="100%"
              class="indigo lighten-1 white--text text-center">
        <v-card-text class="white--text">
          Started with <v-icon>mdi-heart</v-icon> in Bangkok <span class="mx-4">|</span> 
          Code at <a :href="github" target="_blank" style="text-decoration: none;"><v-icon>mdi-github</v-icon> </a> <span class="mx-4">|</span> 
          Now <v-icon>mdi-briefcase</v-icon> in Shanghai
        </v-card-text> 

        <v-divider></v-divider>

        <div class="d-flex justify-space-between">
          <v-card-text class="white--text">
            For Content IP infringement or other matters, please contact <a href="mailto:adrian.fang@pm.me"
               class=" white--text">adrian.fang@pm.me</a></v-card-text>
          <v-card-text>2018~{{ new Date().getFullYear() }} —
            <strong>ONE & mALL | 壹和万物</strong>
          </v-card-text>
        </div>

      </v-card>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      github: "https://github.com/Adrian-Fang/FullstackJS-Ecommerce"
    }
  }
};
</script>