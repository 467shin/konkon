const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const { History } = require("../models/History");
const { auth } = require("../middleware/auth");

// 잔고 조회 기능
router.get("/", auth, async (req, res) => {
  // 여기에 도달했다면 auth 로직을 통과했다는 의미
  res.status(200).json({
    currency: req.user.currency,
  });
});

// 결제 및 금액 수정
router.post("/", auth, async (req, res) => {
  const beforeCurrency = await req.user.currency;
  const paidCurrency = await req.body.pay;
  const afterCurrency = await beforeCurrency.map((n, i) => n + paidCurrency[i]);
  const history = new History({
    userId: req.user._id,
    beforeCurrency,
    paidCurrency,
  });
  history.save().catch((err) => {
    return res.json({ success: false, err });
  });
  User.findOneAndUpdate({ _id: req.user._id }, { currency: afterCurrency })
    .then(() => res.status(200).send({ success: true, currency: afterCurrency }))
    .catch((err) => res.json({ success: false, err }));
});

// 금액 쪼개기
router.patch("/", auth, async (req, res) => {
  const { currency } = await req.user;
  const { unit } = await req.body;
  // 해당 화폐를 하나 빼고
  currency[unit] -= 1;
  // 홀수 번호대는 5n : 짝수 번호대는 1n
  unit % 2 ? (currency[unit + 1] += 5) : (currency[unit + 1] += 2);

  User.findOneAndUpdate({ _id: req.user._id }, { currency })
    .then(() => res.status(200).send({ success: true, currency }))
    .catch((err) => res.json({ success: false, err }));
});

// 잔고 전체 수정
router.put("/", auth, async (req, res) => {
  const beforeCurrency = await req.user.currency;
  const afterCurrency = await req.body.currency;
  // 그냥 바로 등록해줄 수 있지만 revert를 쉽게 해주기 위해...
  const paidCurrency = await beforeCurrency.map((n, i) => afterCurrency[i] - n);
  const history = new History({
    userId: req.user._id,
    status: 1,
    description: "잔고가 재등록되었어요!",
    beforeCurrency,
    paidCurrency,
  });
  history.save().catch((err) => {
    return res.json({ success: false, message: "History save failed" });
  });
  User.findOneAndUpdate({ _id: req.user._id }, { currency: afterCurrency })
    .then(() => res.status(200).send({ success: true, currency: afterCurrency }))
    .catch((err) => res.json({ success: false, message: "User update failed" }));
});

module.exports = router;
