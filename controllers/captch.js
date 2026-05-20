const redis = require("./../redis");
const svgCaptcha = require("svg-captcha");
const uuidv4 = require("uuid").v4;

exports.get = async (req, res, next) => {
  try {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 5,
      color:true
    });
    const uuid = uuidv4();

    await redis.set(
      `captcha:${uuid}`,
      captcha.text.toLowerCase(),
      "EX",
      60 * 5,
    );
    return res.json({ uuid, captcha:captcha.data });
  } catch (err) {
    next(err);
  }
};
