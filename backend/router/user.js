const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

// id check
router.get("/", async (req, res) => {
  const user = await User.findOne({ id: req.body.id });
  if (!user) {
    return res.json({ isValid: true });
  }
  return res.json({ isValid: false });
});

// signUp
router.post("/", async (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

// login
router.patch("/", async (req, res) => {
  const user = await User.findOne({ id: req.body.id });
  try {
    const isMatched = await user.passwordCheck(req.body.password);
    if (!isMatched) {
      throw err;
    }
    user.generateToken().then((userInfo) => {
      // 쿠키에 토큰 저장
      res
        .cookie("x_auth", userInfo.token)
        .status(200)
        .json({ loginSuccess: true, nickname: userInfo.nickname, currency: userInfo.currency });
    });
  } catch (error) {
    res.status(404).json({
      loginSuccess: false,
      message: "Login Failed.",
    });
  }
});

// logout
router.delete("/", auth, async (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then(() => res.status(200).send({ success: true, message: "Logout Success" }))
    .catch((err) => res.json({ success: false, err }));
});

module.exports = router;
