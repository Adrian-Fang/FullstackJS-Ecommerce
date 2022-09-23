<template>
  <div>
    <NavBar />
    <Header />
    <div class="container">
      <v-card width="600" class="mx-auto">
        <v-card-title class="text-h4 justify-center mt-5"> {{$t('registration.join')}} </v-card-title>
        <v-divider></v-divider>

        <!--Form Control part-->
        <v-card-text v-if="regForm.step==1">
          <v-form ref="regForm" v-model="valid" class="pa-3">
            <v-row dense>
              <v-col cols="12" md="12">
                <v-text-field autocomplete="off" v-model="regForm.email" prepend-icon="mdi-email-outline" :rules="regFormRules.email" :label="$t('registration.email')"></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" md="12">
                <v-text-field
                  autocomplete="off"
                  v-model="regForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-icon="mdi-lock-open-outline"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :rules="regFormRules.password"
                  :label="$t('registration.password')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-card-text>{{$t('registration.notice')}}</v-card-text>
            <v-card-actions>
              <v-btn height="30px" block color="success" @click="handleAccountInput">{{$t('registration.nextStep')}}</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>

        <v-card-text v-if="regForm.step==2">
          <!-- second step: verify code -->
          <v-col cols="4">
            <v-text-field v-model="regForm.otp" :rules="[regFormRules.otp]" label="Verification code"></v-text-field>
          </v-col>
          <v-card-actions>
            <v-btn @click="verifyOTP">Verify code</v-btn>
          </v-card-actions>
        </v-card-text>

        <v-card-text v-if="regForm.step==3">
          <v-row class="pl-8" dense>
              <v-col cols="12" md="12"><v-text-field v-model="regForm.otp" :error="!emailVerified" label="Verification code"></v-text-field></v-col> 
              <v-col cols="12" md="2"><v-select v-model="regForm.title" :items="titles" :rules="regFormRules.title" label="Title"></v-select></v-col>
              <v-col cols="12" md="5"><v-text-field v-model="regForm.firstName" :rules="regFormRules.name" label="First name"></v-text-field></v-col>
              <v-col cols="12" md="5"><v-text-field v-model="regForm.lastName" :rules="regFormRules.name" label="Last name"></v-text-field></v-col>
          </v-row>
          <div class="d-flex align-center">
            <v-checkbox class="d-inline-block" v-model="serviceAgreed"></v-checkbox>
            <span>By clicking the box, you accept the<a @click="serviceShow = true">Terms and Conditions</a> and acknowledge the Privacy Policy</span>
          </div>
          <!-- this if for deploying to cloud -->
          <div class="g-recaptcha" data-sitekey="6LeKJ1IaAAAAAMw1GS2Tmfs1X1cH2TP7bm4tHEE_"></div>
          <!-- this if for deploying to localhost -->
          <!-- <div class="g-recaptcha" data-sitekey="6Lfe1sAZAAAAAK9JZU1zNJHwP-CKbde5tNCC2AUh"></div> -->
          <v-card-actions>
            <v-btn height="30px" :disabled="isFormValid" block color="success" @click="handleRegister" >Create Account</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </div>

    <v-dialog
      v-model="serviceShow"
      scrollable
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Use Google's location service?</span>
        </v-card-title>
        <v-card-text
          >Lorem ipsum dolor sit amet, semper quis, sapien id natoque elit. Nostra urna at, magna at
          neque sed sed ante imperdiet, dolor mauris cursus velit, velit non, sem nec. Volutpat sem
          ridiculus placerat leo, augue in, duis erat proin condimentum in a eget, sed fermentum sed
          vestibulum varius ac, vestibulum volutpat orci ut elit eget tortor. Ultrices nascetur
          nulla gravida ante arcu. Pharetra rhoncus morbi ipsum, nunc tempor debitis, ipsum
          pellentesque, vitae id quam ut mauris dui tempor, aptent non. Quisque turpis. Phasellus
          quis lectus luctus orci eget rhoncus. Amet donec vestibulum mattis commodo, nulla aliquet,
          nibh praesent, elementum nulla. Sit lacus pharetra tempus magna neque pellentesque, nulla
          vel erat. Justo ex quisque nulla accusamus venenatis, sed quis. Nibh phasellus gravida
          metus in, fusce aenean ut erat commodo eros. Ut turpis, dui integer, nonummy pede placeat
          nec in sit leo. Faucibus porttitor illo taciti odio, amet viverra scelerisque quis quis et
          tortor, curabitur morbi a. Enim tempor at, rutrum elit condimentum, amet rutrum vitae
          tempor torquent nunc. Praesent vestibulum integer maxime felis. Neque aenean quia vitae
          nostra, tempus elit enim id dui, at egestas pulvinar. Integer libero vestibulum, quis
          blandit scelerisque mattis fermentum nulla, tortor donec vestibulum dolor amet eget, elit
          nullam. Aliquam leo phasellus aliquam curabitur metus a, nulla justo mattis duis interdum
          vel, mollis vitae et id, vestibulum erat ridiculus sit pulvinar justo sed. Vehicula
          convallis, et nulla wisi, amet vestibulum risus, quam ac egestas. Et vitae, nulla gravida
          erat scelerisque nullam nunc pellentesque, a dictumst cras augue, purus imperdiet non.
          Varius montes cursus varius vel tortor, nec leo a qui, magni cras, velit vel consectetuer
          lobortis vel. Nibh erat et wisi felis leo porttitor, sapien nibh sapien pede mi, sed eget
          porttitor, repellendus arcu ac quis. Luctus vulputate aut est sem magna, placerat accumsan
          nunc vestibulum ipsum ac auctor, maecenas lorem in ut nec mauris tortor, doloribus varius
          sem tortor vestibulum mollis, eleifend tortor felis tempus lacus eu eu. Eleifend vel eu,
          nullam maecenas mauris nec nunc euismod, tortor porta ridiculus potenti, massa tristique
          nam magna, et wisi placerat et erat ante. Eget pede erat in facilisis, fermentum venenatis
          sodales. Ac tortor sociis et non animi tristique, rhoncus malesuada, ut arcu volutpat
          scelerisque sollicitudin, elit curabitur dui pede purus dolor, integer aenean risus taciti
          nulla eleifend accumsan. At pulvinar diam parturient, interdum mi velit aliquet et a. Arcu
          at ac placerat eget justo semper, purus sociis curabitur mi ipsum consequat ut, mollis
          vestibulum, est ante ornare lacus sem. Neque magna mauris, commodo quisque, praesent
          semper suscipit lobortis nam. Justo malesuada cursus ac nunc litora nunc. Tellus ac, in
          lobortis nunc, montes lectus purus fermentum. Ac sit wisi. Sodales aliquam, sed vestibulum
          nullam arcu sit risus arcu, id luctus vitae lorem nibh, integer nec nullam class cursus
          mi, purus arcu lectus. Vel ante suscipit volutpat potenti mattis sed, wisi eu placerat
          aliquam erat, lectus morbi lobortis at assumenda. Consequat neque purus ipsum voluptas
          odio, netus vestibulum ut nec, suspendisse pellentesque nec enim in. Wisi dictum sed
          semper a, ipsum erat tellus habitasse est, erat sem ornare, vitae quisque ultricies. Dui
          sed blandit. Tempor et faucibus justo sed luctus, nec vitae vitae. Nunc nibh pede, ipsum
          vestibulum aenean leo ante ultricies, nam cras quis sed penatibus amet. In mauris a.
          Integer metus mauris tortor, et rutrum vestibulum ultricies, ut phasellus in ullamcorper
          ut mollit, eu justo. Cursus pretium venenatis. Cras pellentesque vel sodales accumsan
          aenean. Feugiat metus sit nec in aliquet amet, porttitor pretium vulputate massa.
          Consequat ipsum luctus quisque adipiscing libero. Wisi sollicitudin. Eget vitae ac
          lobortis, lorem natoque vestibulum et, aliquet faucibus at morbi nibh, vel condimentum.
          Massa unde orci sed id sed, odio donec congue nec praesent amet. Hymenaeos velit lacus,
          quis vivamus libero tempus duis, eu nisi eu, ipsum at accumsan pede justo morbi donec,
          massa et libero sit risus neque tortor. Ut sed sed etiam hendrerit dapibus, quis metus
          suspendisse nibh. Fringilla tempor felis augue magna. Cum arcu a, id vitae. Pellentesque
          pharetra in cras sociis adipiscing est. Nibh nec mattis at maecenas, nisl orci aliquam
          nulla justo egestas venenatis, elementum duis vel porta eros, massa vitae, eligendi
          imperdiet amet. Nec neque luctus suscipit, justo sem praesent, ut nisl quisque, volutpat
          torquent wisi tellus aliquam reprehenderit, curabitur cras at quis massa porttitor mauris.
          Eros sed ultrices. Amet dignissim justo urna feugiat mauris litora, etiam accumsan,
          lobortis a orci suspendisse. Semper ac mauris, varius bibendum pretium, orci urna nunc
          ullamcorper auctor, saepe sem integer quam, at feugiat egestas duis. Urna ligula ante. Leo
          elementum nonummy. Sagittis mauris est in ipsum, nulla amet non justo, proin id potenti
          platea posuere sit ut, nunc sit erat bibendum. Nibh id auctor, ab nulla vivamus ultrices,
          posuere morbi nunc tellus gravida vivamus. Mauris nec, facilisi quam fermentum, ut mauris
          integer, orci tellus tempus diam ut in pellentesque. Wisi faucibus tempor et odio leo
          diam, eleifend quis integer curabitur sit scelerisque ac, mauris consequat luctus quam
          penatibus fringilla dis, vitae lacus in, est eu ac tempus. Consectetuer amet ipsum amet
          dui, sed blandit id sed. Tellus integer, dignissim id pede sodales quis, felis dolorem id
          mauris orci, orci tempus ut. Nullam hymenaeos. Curabitur in a, tortor ut praesent placerat
          tincidunt interdum, ac dignissim metus nonummy hendrerit wisi, etiam ut. Semper praesent
          integer fusce, tortor suspendisse, augue ligula orci ante asperiores ullamcorper. In sit
          per mi sed sed, mi vestibulum mus nam, morbi mauris neque vitae aliquam proin senectus. Ac
          amet arcu mollis ante congue elementum, inceptos eget optio quam pellentesque quis
          lobortis, sollicitudin sed vestibulum sollicitudin, lectus parturient nullam, leo orci
          ligula ultrices. At tincidunt enim, suspendisse est sit sem ac. Amet tellus molestie est
          purus magna augue, non etiam et in wisi id. Non commodo, metus lorem facilisi lobortis ac
          velit, montes neque sed risus consectetuer fringilla dolor. </v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="serviceShow = false; serviceAgreed = false;">Disagree</v-btn>
          <v-btn color="green darken-1" text @click="serviceShow = false; serviceAgreed = true;">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      <span class="ml-4" v-html="snackText"></span>
      <v-btn small text color="primary" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import Header from '../components/Header.vue';
const authApi = require('../api/auth'); // not using vuex for email/mobile verification

export default {
  components: { NavBar, Header },
  data() {
    return {
      titles: ['Mrs.', 'Miss', 'Mr.', 'Dr.'],
      serviceAgreed: true,
      serviceShow: false,
      regFormRules: {
        // title: [(v) => !!v || 'Please select a title'],
        // name: [(v) => !!v || 'Name is required'],
        email: [ (v) => !!v || 'Email is required', (v) => /.+@.+/.test(v) || 'Seems like unvalid email address'],
        password: [(v) => !!v || 'Password is required',(v) => v.length >= 6 || 'Please input valid password'],
        otp: [(v) => !!v || 'Verification code is required',(v) => v == this.otp || 'Code incorrect.']
      },
      showPassword: false,
      otp: '',
      emailVerified: false, //TODO: update this field after verify email
      valid: false,
      regForm: {
        step: 1,
        otp: '',
        title: '',
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
      },
      snackbar: false,
      snackText: '',
      snackTimeOut: 2000,
    };
  },
  mounted() {
    var grecaptcha = document.createElement('script');
    grecaptcha.setAttribute('src', 'https://www.google.com/recaptcha/api.js');
    grecaptcha.defer = true;
    grecaptcha.async = true;
    document.head.appendChild(grecaptcha);
  },
  computed: {
    isFormValid() {
      return !(this.valid && this.serviceAgreed);
    },
  },
  methods: {
    async handleAccountInput() {
      let params = {
        email: this.regForm.email
      };
      // Step 1 Check if email already registered
      let userAleradyIn = await authApi.checkUserExist(params);
      if(userAleradyIn.status == 0) {
        this.snackbar = true;
        this.snackText = 'You account already exists, please try log in.';
        setTimeout(() => {
            this.$router.push({ path: '/login' });
          }, 2000);
      } else {
        let result = await authApi.verifyEmail(params);
        if(result.status == 1) {
          //email should be sent in a minute, user have to input the code on next page
          this.snackbar = true;
          this.snackText = 'Email sent, please input the code on the next page.';
          setTimeout(() => {
            this.regForm.step = 3; //TODO: currently OTP and form submission done together
          }, 2000);
        } else {
          console.log('An error occured processing user account verification.')
        }
      }
    },
    async handleRegister() {
      this.$store.dispatch('register', this.regForm).then((res) => {
        if (res.status == 1) {
          this.emailVerified = true;
          this.snackbar = true;
          this.snackText = 'Registration successful! Please login now.';
          setTimeout(() => {
            this.$router.push({ path: '/login' });
          }, 2000);
        } else {
          this.snackbar = true;
          this.snackText = res.msg;
        }
      });
    },
    handleGoogle() {
      let grecaptcha;
      let response = grecaptcha.getResponse();
      const secret = {
        local: '6Lfe1sAZAAAAAO40D4SEzP-CGB1EVXrRQw2GE-18',
        cloud: '6LeKJ1IaAAAAAAvGsVUJEDEkH16zHbTW4b3cPYeO',
      };
      // Use secret.cloud for deployment, secret.local for local development
      let data = {
        secret: secret.cloud,
        response: response,
      };
      const Http = new XMLHttpRequest();
      Http.open('POST', 'https://www.google.com/recaptcha/api/siteverify');
      // Http.onreadystatechange = () => {
      //   console.log(Http.response);
      // };
      Http.send(data);
    },
  },
};
</script>

<style></style>
