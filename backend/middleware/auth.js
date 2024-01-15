const { User } = require("../models/User");

let auth = async (req, res, next) => {
  // 쿠키에서 토큰 가져오기
  let token = req.cookies.x_auth;

  // 토큰 디코딩하고 유저 찾기
  User.findByToken(token)
    .then((user) => {
      // 유저가 없으면 인증 실패
      if (!user) return res.json({ isAuth: false });

      // 유저가 있으면 req에 토큰과 유저 정보를 담고 다음으로
      req.token = token;
      req.user = user;
      next();
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = { auth };
