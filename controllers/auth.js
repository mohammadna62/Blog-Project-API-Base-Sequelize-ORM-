const { User } = require("./../db"); //! Because used of Sequelize
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configs = require("../configs");
const redis = require("./../redis");

exports.register = async (req, res) => {
  const { name, username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    configs.auth.accessTokenSecretKey,
    {
      expiresIn: configs.auth.accessTokenExpiresInSeconds + "s",
    },
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    configs.auth.refreshTokenSecretKey,
    {
      expiresIn: configs.auth.refreshTokenExpiresInSeconds + "s",
    },
  );
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
  await redis.set(
    `refreshToken:${user.id}`,
    hashedRefreshToken,
    "EX",
    configs.auth.refreshTokenExpiresInSeconds,
  );
  return res.status(201).json({
    accessToken,
    refreshToken,
  });
};
exports.login = async (req, res) => {
  const user = req.user;

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    configs.auth.accessTokenSecretKey,
    {
      expiresIn: configs.auth.accessTokenExpiresInSeconds + "s",
    },
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    configs.auth.refreshTokenSecretKey,
    {
      expiresIn: configs.auth.refreshTokenExpiresInSeconds + "s",
    },
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
  await redis.set(
    `refreshToken:${user.id}`,
    hashedRefreshToken,
    "EX",
    configs.auth.refreshTokenExpiresInSeconds,
  );

  return res.status(200).json({ accessToken, refreshToken });
};
exports.getMe = async (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
};

exports.logout = async (req, res) => {
  const redisKey = `refreshToken:${req.user.id}`
  await redis.del(redisKey)
  return res.status(200).json({message:"User Logout Successfully"})
  
};
