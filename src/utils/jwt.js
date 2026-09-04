const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce_jwt_secret_key_2026';

const generateToken = (user) => {
    const payload = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        cart: user.cart,
        role: user.role
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = {
    JWT_SECRET,
    generateToken
};