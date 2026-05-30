const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcrypt");
const configs = require("../configs");
const { User } = require("../db");
const redis = require("../redis");

module.exports = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: configs.auth.refreshTokenSecretKey,
    passReqToCallback: true, //* To Access req properties
  },
  async (req, payload, done) => {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req); //* Raw refreshToken

    const user = await User.findByPk(payload.id, {
      raw: true,
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return done(null, false);
    }

    const hashedRefreshToken = await redis.get(`refreshToken:${user.id}`);

    if (!hashedRefreshToken) {
      return done(null, false);
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      hashedRefreshToken,
    );

    if (!isRefreshTokenValid) {
      return done(null, false);
    }

    done(null, user);
  },
);

// Pure - refreshToken
