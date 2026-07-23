const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { User } = require("../models");
const { paramMissing, success } = require("../utils/response");
const { CONFLICT, CREATED } = require("../utils/httpStatus");
const { USER_EXIST, CREATED } = require("../constants/messages");
const repo = require("../utils/repo");

const md5Hash = (value) =>
  crypto.createHash("md5").update(String(value)).digest("hex");

const register = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if (!email && !mobile) return paramMissing("email or mobile");
    if (!password) return paramMissing("password");

    const where =
      email && mobile
        ? {
            [repo.Op.or]: [{ email }, { mobile: md5Hash(mobile) }],
          }
        : email
          ? { email }
          : { mobile: md5Hash(mobile) };

    const existingUser = await repo.findOne(User, where);

    if (existingUser) return { success: false, message: USER_EXIST, status: CONFLICT };
    const hashedPassword = await bcrypt.hash(password, 10);
    const storedMobile = mobile ? md5Hash(mobile) : null;
    const userData = {
      email: email || null,
      mobile: storedMobile,
      password: hashedPassword,
    };

    const user = await repo.create(User, userData);
    return success(res, user, CREATED, CREATED);
  } catch (error) {}
};

module.exports = { register };
