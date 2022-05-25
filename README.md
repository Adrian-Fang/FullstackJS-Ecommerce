## About

- 项目属性：商城网站 | Type of Project: E-commerce Website
- 已发布｜ Deployed to https://one-mall.netlify.app
- 商家管理后台还未实现 ｜ Currently No admin dashboard yet...

### 技术栈 | Technology Stack

```javascript
vue-cli2 + vue2.5 + vue-router + vuex + axios
vuetify + Material Design Icons
node.js + express
mysql
```

### 功能列表 | Features and Functions

- [x] 登录注册 | Login & Registration | with form validations
- [x] 商品详情 | Product List & Details Page | Simple filter only so far
- [x] 购物车管理 | Shopping Cart | Working
- [x] 结算页面 | Checkout | Fully working
- [x] 在线支付 | Online Payment | Using Omise(Thailand) 
- [x] 简易订单管理 | Order Management System | Not fully suppoted so far
- [x] 国际化 ｜ i18n supported now (2022-May-16) | Language completed, Time & Money format to implement
- [x] 邮件通知 | Email notification (2022-May-22) | Could extend to orders et al.

### How to run project after clone

```javascript

// For Client
....
cd Mall-vue-express
npm install
npm run dev

// For Server
// modify conf.sample.js & create your database first
cd Mall-vue-express/server
npm install
Modify conf.js to make sure configuration work
npm run dev

```

## Test API with Postman
- Make sure your database is configured well, and mysql is up and running
- login with API call to```http://localhost:3000/api/users/login```, to get a jwt token
- Add 'Authorization' to Headers, with value as ```Bearer token_paste_here```

### Todos

- [ ] （Mall）Filter and Sorting...；
- [ ] （数据库）商品分类及属性；
- [ ]  (前端) Error interception & handling such as 500, 403, 401...
- [ ] （前端）商城商品分类下拉菜单，商品 Filter
- [ ] （前端）后台管理系统（商品，权限，员工，物流，订单管理，结算及发票等）

### Reminders

- Remember to copy create database, and configure connection in `server/conf/conf.js`
- The `server.crt`, and `server.key` can be used for enabling https, the configuration is in
  `/build/webpack.dev.conf.js:43-45`

### App screenshots
![Login Page](/project/screenshots/1.png "Login Page")
![Product added to cart](/project/screenshots/2.png "Product added to cart")
![Cart](/project/screenshots/3.png "Cart")
![Checkout / pay online](/project/screenshots/4-1.png "Checkout / pay online")
![Checkout / add address](/project/screenshots/4-2.png "Checkout / add address")
![Checkout / order success](/project/screenshots/5.png "Checkout / order success")
![Order List](/project/screenshots/6.png "Order List")


### Collaborate?

如果想一起实现更多功能，请提 Issue ｜ Create Issue to collaborate;
