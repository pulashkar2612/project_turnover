const express = require("express");
const {addProductsController, getProductsController} = require("../controllers/productController")
const router = express.Router();

router.post("/addAllProducts", addProductsController);
router.get("/getProducts", getProductsController)

module.exports = router;