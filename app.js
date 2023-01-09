const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
//사용하는 npm i


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
//사용하는 앱

const port = 4080
const users = require('./db/users')
const articles = require('./db/articles')
//포트 설정,외부 db(로컬내 json으로 구현)

let corsOptions = {
    origin: 'http://localhost:3080',
    credentials: true
}
//cors 쓰려면 프론트 포트 지정할때 쓴데서 써봤습니다

const jwtConfig = {
    secretKey: "secretKey",//시크렛키
    options: {
        algorithm: "HS256",//상황보고 주석화
        expiresIn: "15m",//1분짧더라
        issuer: "bongjin"//발행자
    }

}
//jwt 쓰기, 밖으로 뺄까?

app.get('/', (req, res) => {
    const tenArticles = [...articles]
    res.send(tenArticles.splice(0, 10))
})
//게시글 상위 10개 가져오는 API,

// 로그인 API
app.post('/login', (req, res) => {
    //     - email, password 받아서 해당하는 유저가 존재하는지 확인
    const { email, password } = req.body
    // const user = users.find(user => user.email === email && user.password === password)
    const user = users.find(user => user.email === email)
    if (!user) {
        res.status(404).json({
            errorMessage: '해당 아이디가 없습니다.'
        })
    }
    // const userPass = users.find(user => user.password === password)
    // if (!userPass) {
    //     res.status(404).json({
    //         errorMessage: '비밀번호가 틀립니다.'
    //     })
    // } //이건 유저 비밀번호가 아닌 그냥 모든 비번중에 찾는거라 틀립니다

    if (user.password !== password) {
        res.status(404).json({
            errorMessage: '비번이 틀렸습니다.'
        })
    }
// 고침


    const token = jwt.sign({ name: user.name, id: user.id }, jwtConfig.secretKey, jwtConfig.options)
    res.cookie('jwt', token)
    console.log(req.cookies)
    res.send({ result: true })
})

app.get('/articles', (req, res) => {
    res.json(articles)
})//게시글 보기,대강 한번에 다 보임

app.post("/articles", (req, res) => {

})//게시글 쓰기


app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});