const GoogleStrategy = require("passport-google-oauth20");
const { default: slugify } = require("slugify");
const { User } = require("../db");
const configs = require("../configs");

module.exports = new GoogleStrategy(
  {
    clientID: configs.auth.google.clientId,
    clientSecret: configs.auth.google.clientSecret,
    callbackURL: `${configs.domain}/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;

    let user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return done(null, user);
    }

    const name = `${profile.name.givenName} ${profile.name.familyName}`;
    const username =
      slugify(name, { lower: true }).replace(/[\.-]/g, "") +
      Math.floor(1000 + Math.random() * 999);
      
    await User.create({
      name,
      username,
      email,
      provider: "google",
      avatar:profile.photos[0].value
    });
    done(null, user);
  },
);
