const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { SECRET_CODE } = process.env;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  nickname: {
    type: String,
    maxlength: 20,
  },
  id: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
  },
  currency: {
    type: Array,
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// save 전에 실행되는 비밀번호 암호화 로직
userSchema.pre("save", function (next) {
  let user = this;

  if (user.isModified("password")) {
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(user.password, salt))
      .then((hash) => {
        user.password = hash;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

// 비밀번호 유효성 검증
userSchema.methods.passwordCheck = async function (plainPassword) {
  // plainPassword && hashedPasword
  return await bcrypt.compare(plainPassword, this.password);
};

// token 생성
userSchema.methods.generateToken = async function () {
  let user = this;
  user.token = await jwt.sign(user._id.toJSON(), SECRET_CODE);
  return user.save();
};

// 토큰으로 유저 찾기
userSchema.statics.findByToken = async function (token) {
  let user = this;

  try {
    const decoded = await jwt.verify(token, SECRET_CODE);
    // token을 디코딩하여 얻은 id와
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인하여 반환
    return user.findOne({ _id: decoded, token: token });
  } catch (err) {
    // 토큰에러
    console.log("err:", err);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
