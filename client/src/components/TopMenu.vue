<template>
  <div class="menu-bar d-flex pl-1">
    <div
      class="menu-item"
      v-for="(lv1, index1) in category"
      :key="index1"
      @mouseover="showSubMenu(index1)"
      @mouseleave="hideSubMenu()"
    >
      <a class="grey--text darken-5 text-uppercase text-decoration-none" :href="lv1.link">{{ lv1.text }}</a>
      <transition name="fade" appear>
        <div class="dropdown-menu-layer pb-3" v-show="subMenuIndex === index1 && showDropDown">
          <div class="mx-auto" max-width="500" v-for="(lv2, index2) in lv1.subCategory" :key="index2">
            <v-list dense shaped>
              <v-subheader :href="lv2.link">{{ lv2.text }}</v-subheader>
              <v-list-item-group>
                <v-list-item v-for="(lv3, index3) in lv2.subCategory" :key="index3" @click="goto(lv3.link)">
                  <v-list-item-content>
                    <v-list-item-title :href="lv3.link">{{ lv3.text }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDropDown: false,
      subMenuIndex: '',
      category: [
        {
          text: 'Mens',
          link: '#/mall',
          subCategory: [
            {
              text: 'Underware',
              link: '_blank',
              subCategory: [
                { text: 'Jackets', link: '_blank' },
                { text: 'Hoodies', link: '_blank' },
                { text: 'Sweatshirts', link: '_blank' },
                { text: 'Sportswear', link: '_blank' },
              ],
            },
            {
              text: 'Shirts',
              link: '_blank',
              subCategory: [
                { text: 'Suits', link: '_blank' },
                { text: 'Pants', link: '_blank' },
                { text: 'Belt', link: '_blank' },
                { text: 'Watches', link: '_blank' },
              ],
            },
          ],
        },
        {
          text: 'Women',
          link: '#/mall',
          subCategory: [
            {
              text: 'CASUAL',
              link: '_blank',
              subCategory: [
                { text: 'Jackets', link: '_blank' },
                { text: 'Hoodies', link: '_blank' },
                { text: 'Sweatshirts', link: '_blank' },
                { text: 'Sportswear', link: '_blank' },
              ],
            },
            {
              text: 'BUSINESS',
              link: '_blank',
              subCategory: [
                { text: 'Suits', link: '_blank' },
                { text: 'Pants', link: '_blank' },
                { text: 'Belt', link: '_blank' },
                { text: 'Watches', link: '_blank' },
              ],
            },
          ],
        },
        {
          text: 'Others',
          link: '#/mall',
          subCategory: [
            {
              text: '其他1',
              link: '_blank',
              subCategory: [
                { text: 'Jackets', link: '_blank' },
                { text: 'Hoodies', link: '_blank' },
                { text: 'Sweatshirts', link: '_blank' },
                { text: 'Sportswear', link: '_blank' },
              ],
            },
            {
              text: '其他2',
              link: '_blank',
              subCategory: [
                { text: 'Suits', link: '_blank' },
                { text: 'Pants', link: '_blank' },
                { text: 'Belt', link: '_blank' },
                { text: 'Watches', link: '_blank' },
              ],
            },
          ],
        },
        {
          text: 'Promoted',
          link: '#/mall',
          subCategory: [
            {
              text: '促销男士',
              link: '_blank',
              subCategory: [
                { text: 'Jackets', link: '_blank' },
                { text: 'Hoodies', link: '_blank' },
                { text: 'Sweatshirts', link: '_blank' },
                { text: 'Sportswear', link: '_blank' },
              ],
            },
            {
              text: '促销女士',
              link: '_blank',
              subCategory: [
                { text: 'Suits', link: '_blank' },
                { text: 'Pants', link: '_blank' },
                { text: 'Belt', link: '_blank' },
                { text: 'Watches', link: '_blank' },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    showSubMenu(index1) {
      this.subMenuIndex = index1;
      this.showDropDown = true;
    },
    hideSubMenu() {
      this.showDropDown = false;
    },
    goto(link) {
      this.$router.push(link);
    },
  },
};
</script>

<style lang="scss">
.menu-bar {
  border-top: 1px solid #efeff4;
  border-bottom: 1px solid #efeff4;
  height: 40px;
  .menu-item {
    max-width: 30%;
    text-align: center;
    padding: 10px 15px;
    font-size: 14px;
    transition: all 0.2s ease-in-out;
  }
}

/* dropdown layer style */
.dropdown-menu-layer {
  /* outer style */
  position: absolute;
  z-index: 99;
  background-color: #fff;
  top: 140px;
  left: 50%;
  transform: translateX(-50%);
  width: 94%;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  border-radius: 0 0 5px 5px;
  /* inner style */
  display: flex;
  justify-content: space-around;
}

/* dropdown layer transition effects starts */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
/* dropdown layer transition effects ends */
</style>
