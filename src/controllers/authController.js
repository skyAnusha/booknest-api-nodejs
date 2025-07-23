const User = require("../models/user");
const { signupSchema } = require('../validators/user');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    logger.warn(error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) {
      logger.warn(`Email already used: ${email}`);
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    if (!(await user.comparePassword(password))) {
      logger.error(`Password check failed for: ${email}`);
      return res.status(500).json({ message: "Password error" });
    }

    logger.info(`New user registered: ${email}`);
    res.status(201).json(user);
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(500).json({ message: "Registration failed" });
  }
};