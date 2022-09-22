const { getProducts, createOneProduct } = require("./products.swagger");

module.exports = {
    openapi: "3.0.3",
    info: {
        version: "0.2.0",
        title: "One-Mall-API", 
        description: "This API serves front-end project hosted here: https://one-mall.netlify.app",
        contact: {
            name: "Adrian Fang",
            url: "https://github.com/Adrian-Fang/FullstackJS-Ecommerce",
            email: "username@gmail.com",
        }
    },
    servers:[
    {
      url: "http://localhost:3000/api/v1",
      description: "Local server"
    },
    {
      url: "http://one-mall.herokuapp.com/api/v1",
      description: "Dev server"
    },
  ],
  paths: {
      "/products": {
        "get": getProducts,
        "post": createOneProduct
      }
  },
  components: {
    securitySchemes: {
      api_key:{
        type: "apiKey",
        description: "need JWT token issued from server, placing in request headers",
        name: "Authorization",
        in: "header"
      }
    }
  },

}