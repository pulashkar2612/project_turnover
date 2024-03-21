const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // Add more fields as needed
});

// Create Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;