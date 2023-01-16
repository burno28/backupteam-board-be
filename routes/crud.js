const express = require("express");
const router = express.Router();

//login api
router.post("/login", (req,res) => {
    const { email, password } = req.body
    const user = users.find(user => user.email === email)
    if (!user) {
        res.status(404).json({
            errorMessage: '해당 아이디가 없습니다.'
        })
    }
    if (user.password !== password) {
        res.status(404).json({
            errorMessage: '비번이 틀렸습니다.'
        })
    }

    const token = jwt.sign({ name: user.name, id: user.id }, jwtConfig.secretKey, jwtConfig.options)
    res.cookie('jwt', token)
    console.log(req.cookies)
    res.send({ result: true })
});

//profile api
router.get('/profile', (req, res) => {
    const userToken = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)

    if (!userToken) {
        return res.send("로그인 부탁드립니다")
    }
    const user = users.find(user => user.email === email)
    if (!user) {
        return res.send("입력하신 email이 틀렸습니다")
    }
    res.json(user)
})

app.get('/articles', (req, res) => {
    res.json(articles)
})