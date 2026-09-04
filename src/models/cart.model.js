const mongoose = require('mongoose');

const cartCollection = 'Carts';

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, {
    timestamps: true,
    versionKey: false
});

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = cartModel;