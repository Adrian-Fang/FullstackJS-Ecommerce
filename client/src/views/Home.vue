<template>
  <div>
    <NavBar />
    <Header />
    <top-menu></top-menu>
    <v-carousel
      class="my-1"
      height="300"
      cycle
      interval="4000"
      show-arrows-on-hover
      hide-delimiter-background
      delimiter-icon="mdi-minus"
    >
      <v-carousel-item
        v-for="(slide, index) in slides"
        :key="index"
        :src="slide.src"
        :href="slide.href"
        reverse-transition="fade-transition"
        transition="fade-transition"
      ></v-carousel-item>
    </v-carousel>
    <div class="my-5">
      <v-container fluid>
        <v-row dense>
          <v-col v-for="index in [0, 1, 2]" :key="index" cols="4">
            <v-card class="mx-auto" max-width="400">
              <v-img
                class="white--text align-end"
                height="200px"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
              >
                <v-card-title>Top 10 Australian beaches</v-card-title>
              </v-img>

              <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>Whitehaven Beach</div>

                <div>Whitsunday Island, Whitsunday Islands</div>
              </v-card-text>

              <v-card-actions>
                <v-btn color="orange" text>
                  Share
                </v-btn>

                <v-btn color="orange" text>
                  Explore
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="my-5 promoted d-flex justify-space-around px-2">
      <div><v-img height="280" width="560" src="/static/promoted-pics/1.jpg"></v-img></div>
      <div><v-img height="280" width="560" src="/static/promoted-pics/2.png"></v-img></div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Header from '@/components/Header.vue';
import TopMenu from '@/components/TopMenu.vue';

export default {
  components: {
    NavBar,
    'top-menu': TopMenu,
    Header,
  },
  data() {
    return {
      slides: [
        {
          src: '../../static/slide-img/14766931740570.jpg',
          title: '',
          href: 'http://localhost:8081/#/mall',
        },
        {
          src: '../../static/slide-img/15144381201181.jpg',
          title: '',
          href: 'http://localhost:8081/#/mall',
        },
        {
          src: '../../static/slide-img/15144443267556.jpg',
          title: '',
          href: 'http://localhost:8081/#/mall',
        },
        {
          src: '../../static/slide-img/15144482787248.jpg',
          title: '',
          href: 'http://localhost:8081/#/mall',
        },
      ],
    };
  },
};
</script>

<style></style>
