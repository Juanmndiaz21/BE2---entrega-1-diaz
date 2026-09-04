const passport = require('passport');
const jwt = require('passport-jwt');
const userModel = require('../models/user.model');
const { JWT_SECRET } = require('../utils/jwt');

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'] || null;
    }
    return token;
};

const initializePassport = () => {
    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            cookieExtractor
        ]),
        secretOrKey: JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            const user = await userModel.findById(jwt_payload.id).lean();
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado.' });
            }
            delete user.password;
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
};

module.exports = initializePassport;