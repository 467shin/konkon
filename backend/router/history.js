const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const { History } = require("../models/History");
const { auth } = require("../middleware/auth");

router.use((req, res, next) => {
  console.log("middleware for histories!");
  next();
});

// 히스토리 전체 조회
router.get("/", auth, async (req, res) => {
  const histories = await History.find({ userId: req.user._id });
  return res.status(200).json(histories);
});

// 히스토리 수정
router.patch("/", auth, async (req, res) => {
  const history = await History.findOne({ _id: req.body._id });
  try {
    history.description = req.body.description;
    history.save().then(() => res.status(200).json({ success: true, message: "Update success" }));
  } catch {
    return res.json({ success: false, message: "Update failed" });
  }
});

// 히스토리 삭제
router.delete("/", auth, async (req, res) => {
  History.findOneAndDelete({ _id: req.body._id })
    .then((deletedHistory) => {
      if (!deletedHistory) throw err;
      return res.status(200).json({ success: true, message: "Delete success" });
    })
    .catch(() => res.json({ success: false, message: "Delete failed" }));
});

module.exports = router;
