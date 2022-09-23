## About

项目属性：商城网站

### Todos

- ADD （数据库）商品分类及属性；
- MOD  (前端) Error interception & handling such as 500, 403, 401...
- ADD （前端）后台管理系统（商品，权限，员工，物流，订单管理，结算及发票等）

### How to run project after clone

#### For Client (front-end)

```shell
cd Mall-vue-express
npm install
npm run dev
```
Then Website runs on: http://localhost:8080

### 项目说明

- 用到的技术栈

  ```javascript
  vue-cli2 + vue2.5 + vue-router + vuex + axios
  vuetify
  node.js + express
  mysql2
  ```

- 实现功能

```
    - 登录注册( password encryption safer with bcryptjs)
    - 商品详情
    - 购物车管理
    - 地址管理
    - 在线支付 (Suppors Omise(Thailand) Payment Gateway, use Cards, Alipay、Bill Payment to try out..)
    - 订单管理 (Not fully suppoted yet)
    - 国际化 
    - 注册 （邮箱验证码）
```

## Modifications

⚠️ `webpack.dev.conf.js` 和 `webpack.prod.conf.js` 默认 `{usePostCSS: true}` 已经修改为`false`；
⚠️ `webpack`自定义配置已完全移除
