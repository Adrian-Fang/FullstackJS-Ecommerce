<template>
  <div class="container">
    <div class="checkout-page">
      <div class="container">
        <div class="checkout-addr">
          <div class="page-title-normal">
            <h2 class="page-title-h2">
              <span>确认信息</span>
            </h2>
          </div>
          <!-- process step -->
          <div class="check-step">
            <ul>
              <li class="cur"><span>确认</span>地址</li>
              <li><span>查看</span>订单</li>
              <li><span>创建</span>支付</li>
              <li><span>订单</span>成功</li>
            </ul>
          </div>

          <!-- address list -->
          <div class="page-title-normal checkout-title">
            <h2>
              <span>选择收货地址</span>
            </h2>
          </div>
          <div class="addr-list-wrap">
            <div class="addr-list">
              <ul>
                <li v-for="item in limitAdressNum" :key="item" :class="{ check: item.isDefault === 1 }">
                  <dl>
                    <dt>{{ item.userName }}</dt>
                    <dd class="address">{{ item.streetName }}</dd>
                    <dd class="tel">{{ item.tel }}</dd>
                  </dl>
                  <div class="addr-opration addr-del" @click="delConfirm(item)">
                    <a href="javascript:;" class="addr-del-btn">
                      <svg class="icon icon-del">
                        <use xlink:href="#icon-del" />
                      </svg>
                    </a>
                  </div>
                  <div class="addr-opration addr-default">
                    <a
                      href="javascript:;"
                      class="addr-set-default-btn"
                      @click="setDefault(item.addressId), (this.addrId = item.addressId)"
                      v-if="item.isDefault !== 1"
                    >
                      <i>设为默认</i>
                    </a>
                  </div>
                  <div class="addr-opration addr-default" v-if="item.isDefault === 1">默认地址</div>
                </li>
                <li class="addr-new" @click="insrtConfim">
                  <div class="add-new-inner">
                    <i class="icon-add">
                      <svg class="icon icon-add">
                        <use xlink:href="#icon-add" />
                      </svg>
                    </i>
                    <p>添加新地址</p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="shipping-addr-more">
              <a class="addr-more-btn up-down-btn" href="javascript:;" v-on:click="limitNum = addressData.length">
                更多
                <i class="i-up-down">
                  <i class="i-up-down-l"></i>
                  <i class="i-up-down-r"></i>
                </i>
              </a>
            </div>
          </div>

          <!-- shipping method-->
          <div class="page-title-normal checkout-title">
            <h2>
              <span>配送方式</span>
            </h2>
          </div>
          <div class="shipping-method-wrap">
            <div class="shipping-method">
              <ul>
                <li class="check">
                  <div class="name">标准配送</div>
                  <div class="price">免邮</div>
                  <div class="shipping-tips">
                    <p>若要选择其他快递,请与客服联系并补运费差价!</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="next-btn-wrap">
            <router-link class="btn btn--m btn--red" :to="{ path: 'orderconfirm', query: { addressId: addrId } }"
              >提交订单</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      addressData: [],
      limitNum: 3,
      delAdr: '',
      newAddressList: [],
    };
  },
  mounted() {
    this.getAddressList();
  },
  computed: {
    limitAdressNum: function() {
      return this.addressData.slice(0, this.limitNum);
    },
    addrId() {
      var addId = 0;
      this.addressData.forEach((item, index) => {
        if (item.isDefault == 1) {
          addId = item.addressId;
        }
      });
      return addId;
    },
  },
  methods: {
    getAddressList() {
      axios.get('/api/users/addressList').then((res) => {
        res = res.data;
        if (res.status === '1') {
          this.addressData = res.result;
          // console.log(res.result);
        } else {
          console.log(res.msg);
        }
      });
    },
    delConfirm(item) {
      this.mdShow = true;
      this.delAdr = item;
    },
    deleteAdr() {
      var index = this.addressData.indexOf(this.delAdr);
      var param = {
        addressId: this.delAdr.addressId,
      };
      axios
        .get('/api/users/delAdr', {
          params: param,
        })
        .then((res) => {
          res = res.data;
          if (res.status === '1') {
            this.addressData.splice(index, 1);
            this.mdShow = false;
          }
        });
    },
    insrtConfim() {
      this.insertShow = true;
    },
    insertAdr(item) {
      this.newAddressList = item;
      // console.log(this.newAddressList.userName);
      var param = {
        userName: this.newAddressList.userName,
        streetName: this.newAddressList.streetName,
        postCode: this.newAddressList.postCode,
        tel: this.newAddressList.tel,
        isDefault: 0,
      };
      this.addressData.push(param);
      axios
        .get('/api/users/insertAdr', {
          params: param,
        })
        .then((res) => {
          res = res.data;
          if (res.status === '1') {
            this.insertShow = false;
          }
        });
    },
    setDefault(item) {
      this.addressData.forEach((list, index) => {
        if (item == list.addressId) {
          list.isDefault = 1;
        } else {
          list.isDefault = 0;
        }
      });
      var param = {
        addressId: item,
      };
      axios
        .get('/api/users/setDefauleAdr', {
          params: param,
        })
        .then((res) => {
          res = res.data;
          if (res.status === '1') {
            // console.log('设置成功');
          }
        });
    },
  },
};
</script>
<style></style>
