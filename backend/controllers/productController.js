const expressAsyncHandler = require("express-async-handler");
const productsModel = require("../models/productsModel");
const { faker } = require('@faker-js/faker');

const addProductsController = expressAsyncHandler(async (req, res, next) => {
    try {
        const products = [];
        for (let i = 0; i < 100; i++) {
            products.push({
                name: faker.commerce.product()
            });
        }
        await productsModel.insertMany(products);
        res.json({ message: 'Products added successfully' });
    } catch (error) {
        console.error('Error adding products:', error);
        res.status(500).json({ error: 'An error occurred while adding products' });
    }
})

const getProductsController = expressAsyncHandler(async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const skip = (page - 1) * pageSize;
        const productsCount = await productsModel.countDocuments();
        const products = await productsModel.find().skip(skip).limit(pageSize);

        res.json({success: true, data: products, count: productsCount});
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
})

module.exports = {
    addProductsController,
    getProductsController
};