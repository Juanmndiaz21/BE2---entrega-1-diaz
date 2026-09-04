const { Router } = require('express');
const passport = require('passport');
const userModel = require('../models/user.model');
const cartModel = require('../models/cart.model');
const { createHash, isValidPassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios.' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'El correo electronico ya se encuentra registrado.' });
        }

        const newCart = await cartModel.create({ products: [] });

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
            role: role || 'user'
        };

        const result = await userModel.create(newUser);
        const userToReturn = result.toObject();
        delete userToReturn.password;

        return res.status(201).json({
            status: 'success',
            message: 'Usuario registrado exitosamente.',
            payload: userToReturn
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Debe ingresar email y password.' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Credenciales invalidas.' });
        }

        if (!isValidPassword(user, password)) {
            return res.status(401).json({ status: 'error', message: 'Credenciales invalidas.' });
        }

        const token = generateToken(user);

        return res
            .cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
            .status(200)
            .json({
                status: 'success',
                message: 'Inicio de sesion exitoso.',
                token
            });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/current', (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const message = info && info.message ? info.message : 'No autenticado o token invalido.';
            return res.status(401).json({ status: 'error', message });
        }
        return res.status(200).json({
            status: 'success',
            payload: user
        });
    })(req, res, next);
});

module.exports = router;