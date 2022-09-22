const getProducts = {
    tags: ['Products'],
    summary: "get all products with predefined query parameters",
    parameters: [
        {
            name: "sort",
            in: "query",
            description: "A field used for sorting results",
            required: false,
            schema: {
                type: "string",
                example: "-productPrice"
            }
        },
        {
            name: "pageNum",
            in: "query",
            description: "Number of page where products listed",
            required: false,
            schema: {
                type: "number",
                example: 1
            }
        },
        {
            name: "pageSize",
            in: "query",
            description: "Size of product list fetched each time.",
            required: false,
            schema: {
                type: "number",
                example:4
            }
        },
    ],
    responses: {
        "200": {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            status: {
                                type: "string",
                                example: "OK"
                            },
                            data: {
                                type: "array",
                                items: {
                                    type: "object"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

const createOneProduct = {
    tags: ['Products'],
    summary: "Create a single product.",
    security: {
        api_key: []
    },
    requestBody: {
        description: "Add a product to database",
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        productName: {
                            type: "string",
                            example: "Swagger UI created product"
                        },
                        productPrice: {
                            type: "number",
                            example: 99.99
                        },
                        productID: {
                            type: "number",
                            example: 90001
                        }
                    },
                    required: ["productName", "productPrice", "productID"]
                }
            }
        }
    },
    responses: {
        "201": {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            status: {
                                type:"string",
                                example: "1"
                            },
                            data: {
                                type: "array",
                                items: {
                                    type: "object"
                                }
                            }
                        }
                    }
                }
            }
        },
        "401": {
            content:{
                "application/json": {
                    schema:{
                        type: "string",
                        example: "Access denied, please login"
                    }
                }
            }
        }
    }
}

module.exports = {
    getProducts, 
    createOneProduct
}