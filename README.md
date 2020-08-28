# About

项目属性：商城网站 | Type of Project: E-commerce Website
商家管理后台还未实现 ｜ Currently No admin dashboard yet...

## 技术栈 | Technology Stack

```javascript
vue-cli2 + vue2.5 + vue-router + vuex + axios
vuetify + Material Design Icons
node.js + express
mysql
```

## 功能列表 | Features and Functions

```
- 登录注册 | Login & Registration
- 商品详情 | Product List & Details Page (Very Simple Version)
- 购物车管理 | Shopping Cart
- 结算页面 | checkout (Including address management)
- 在线支付 | Online Payment (Used Omise(Thailand) for testing)
- 订单管理 (Not fully suppoted yet)
```

## How to run project after clone

```javascript

// For Client end
....
cd Mall-vue-express
npm install
npm run dev
// Then Website runs on: http://localhost:8081

// For Server end
cd Mall-vue-express/server
npm install
npm start
# Then Express Server runs on: https://localhost:443


```

## Todos

- ADD （Mall）Filter and Sorting...；
- ADD （i18n）Not supported now；
- ADD （数据库）商品分类及属性；
- ADD （前端）商城商品分类下拉菜单，商品 Filter
- ADD （前端）后台管理系统（商品，权限，员工，物流，订单管理，结算及发票等）

## Reminders

- Remember to copy create database, and configure connection in `server/conf/conf.js`
- The `server.crt`, and `server.key` can be used for enabling https, the configuration is in
  `/build/webpack.dev.conf.js:43-45`
  
## 一起完善？Teamup？
如果想一起实现更多功能，请提 Issue ｜ Create Issue to work together;
