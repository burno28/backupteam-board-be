const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const {jwtConfig} = require("../config/config")
// const {???} = require("../repositories/index")

// 로그인 API 
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const loginSql = `select * from users where email = "${email}" and password = "${password}";`
    connection.query(loginSql, (error, rows, fields) => {
        if (!rows[0]) {
            return res.status(404).json({ message: "email not found" });
        }
        const token = jwt.sign({ email: rows[0].email }, jwtConfig.secretKey, jwtConfig.options);
        res.cookie('jwt', token);

        res.json({ message: "wellcome" });
    })
})

//쿠키로 특정 사용자 정보를 가져오는 API (JWT)
app.get('/profile', (req, res) => {
    if (!req.cookies.jwt) {
        return res.json({ message: "for members only" });
    }
    const userToken = jwt.verify(req.cookies.jwt, jwtConfig.secretKey);
    const { email } = userToken
    connection.query(`select name, email from users where email = "${email}";`, (error, rows, fields) => {
        res.send(rows[0])
    })
});
