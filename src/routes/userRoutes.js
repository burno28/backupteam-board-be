const express = require("express")
const router = express.Router()
// const jwt = require("jsonwebtoken")//안씀,흔적기관
// const {jwtConfig} = require("../config/config")//안씀,흔적기관
const {getUserInfos,login,logout,signup} = require('../controller/userController')

router.post('/login', login)
//ㄴ로그인 API 
router.get('/userInfos', getUserInfos)
//ㄴ유저정보 가져오기인데 주소나 변수이름 변경필요 
//ㄴㄴ쿠키로 특정 사용자 정보를 가져오는 API (JWT)
router.get("/logout",logout)
//로그아웃
router.post("/signup",signup)
//회원가입

module.exports = router