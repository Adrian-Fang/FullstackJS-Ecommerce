<template>
  <div>
    <NavBar />
    <Header />
    <v-carousel class="my-1 px-2"
                height="400"
                cycle
                interval="4000"
                show-arrows-on-hover
                hide-delimiter-background
                delimiter-icon="mdi-minus">
      <v-carousel-item v-for="(slide, index) in slides"
                       :key="index"
                       :src="slide.src"
                       :href="slide.href">
      </v-carousel-item>
    </v-carousel>
    <div class="my-5">
      <v-container fluid>
        <v-row dense>
          <v-col md="4"
                 sm=12>
            <v-card class="mx-auto"
                    max-width="400">
              <v-img class="white--text align-end"
                     height="200px"
                     src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
                <v-card-title>Top 10 Australian beaches</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Whitehaven Beach</div>
                <div>Whitsunday Island, Whitsunday Islands</div>
              </v-card-text>
              <v-card-actions>
                <v-btn color="orange"
                       text>
                  Share
                </v-btn>
                <v-btn color="orange"
                       text>
                  Explore
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col md="4"
                 sm=12>
            <v-card class="mx-auto"
                    max-width="400">
              <v-img class="white--text align-end"
                     height="200px"
                     src="https://cdn.vuetifyjs.com/images/cards/house.jpg">
                <v-card-title>Pre-fab homes</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Number 9</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Pre-fab homes</div>
                <div>Pre-fab homes Whitsunday Islands</div>
              </v-card-text>
              <v-card-actions>
                <v-btn color="orange"
                       text>
                  Share
                </v-btn>
                <v-btn color="orange"
                       text>
                  Explore
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col md="4"
                 sm=12>
            <v-card class="mx-auto"
                    max-width="400">
              <v-img class="white--text align-end"
                     height="200px"
                     src="https://cdn.vuetifyjs.com/images/cards/road.jpg">
                <v-card-title>Favorite road trips</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Number 8</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Favorite road trip</div>
                <div>Favorite road trip, Whitsunday Islands</div>
              </v-card-text>
              <v-card-actions>
                <v-btn color="orange"
                       text>
                  Share
                </v-btn>
                <v-btn color="orange"
                       text>
                  Explore
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-row class="my-5 promoted d-flex justify-space-around px-2">
      <v-col sm=12
             md=6>
        <v-img height="280"
               class="mx-auto"
               src="/static/promoted-pics/1.jpg"></v-img>
      </v-col>
      <v-col sm=12
             md=6>
        <v-img height="280"
               class="mx-auto"
               src="/static/promoted-pics/2.png"></v-img>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Header from "@/components/Header.vue";

export default {
  components: {
    NavBar,
    Header,
  },
  data() {
    return {
      slides: [
        {
          src: "../../static/slide-img/14766931740570.jpg",
          title: "",
          href: "/#/mall",
        },
        {
          src: "../../static/slide-img/15144381201181.jpg",
          title: "",
          href: "/#/mall",
        },
        {
          src: "../../static/slide-img/15144443267556.jpg",
          title: "",
          href: "/#/mall",
        },
        {
          src: "../../static/slide-img/15144482787248.jpg",
          title: "",
          href: "/#/mall",
        },
      ],
    };
  },
};
</script>

<style></style>
