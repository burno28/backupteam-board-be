const express = require('express')//사용하는 패키지
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')

const app = express()
app.use(express.json())
app.use(cookieParser())
// app.use(cors())

const connection = mysql.createConnection({
    host: "caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com",
    user: "sparta",
    password: "tmvkfmxk2022",
    database: "sparta_backup",
})

connection.connect()//node.js와 mysql을 실제 연결함

let corsOptions = {
    origin: 'http://localhost:3080',
    credentials: true
}//cors 쓰려면 프론트 포트 지정할때 쓴데서 써봤습니다,지금안함

const jwtConfig = {
    secretKey: "secretKey",//시크렛키
    options: {
        algorithm: "HS256",//상황보고 주석화
        expiresIn: "15m",//1분짧더라
        issuer: "bongjin"//발행자
    }

}//jwt 쓰기, 밖으로 뺄까?

// app.get('/', (req, res) => {

//     const articles =  connection.query("select * from articles order by id desc")
//     const tenArticles = [articles]
//     res.send(tenArticles.splice(0, 10))
// })
//게시글 상위 10개 가져오는 API,

// 로그인 API api로 뺐음
app.post('/login', (req, res) => {
    const { email, password } = req.body
    // connection.query(`SELECT * FROM users WHERE email="${email}`, (err, result) =>{
    //     if (err) return console.log(err)

    //     if(result.length) {
    //         console.log(result)
    //         if (result[0].password === password) {
    //             console.log("login-sucess")
    //         }else{
    //             console.log("login-fail")
    //         }
    //         }
    //     })
    // })

    const sql = `select * from users where email = "${email}" and password = "${password}"`
    if (email && password) {
        connection.query(sql, (error, rows, fields) => {     
            if (!email || password !== user.password) {
                res.status(400).send({
                  errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
                })
                return
              }
            const token = jwt.sign({ name: user.name, email: user.email }, jwtConfig.secretKey, jwtConfig.options)
            res.cookie('user_token', token)
            console.log(token)
}) }  })




//쿠키로 특정 사용자 정보를 가져오는 API (JWT)
app.get('/profile', (req, res) => {
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
    const { page } = req.query
    const perPage = 3 //제 테이블 20개 칼럼이라 임시로 3
    const startIndex = ((page || 1) - 1) * perPage //0111참조
    connection.query(`select count(*) from bongjin_articles_1`, (error, rows, fields) => {
        const lastPage = Math.ceil(rows[0].count / perPage)
        connection.query(`select * from bongjin_articles_1 order by id desc limit ${perPage} offset ${startIndex}`, (error, rows, fields) => {
          res.json({
              pageInfo : {
                perPage,
                lastPage,
                currentPage: page || 1
              },
              rows})
        })
      })
    })

////게시글 등록
// app.post("/articles",  async (req, res) => {
//     const userToken = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)
//     if (!userToken) {//     - 로그인 했는지 확인 
//         return res.send("로그인 부탁드립니다")
//         //     - 로그인 안되어있으면 예외처리
//         const { title, content } = req.body;
//         try {
//             await article.create({
//                 title,
//                 content,
//                 author: "" //유저 넣어야 할거 같다
//             });
//             res.redirect("/"); //완료시 메인페이지로 이동
//         } catch (err) {
//             next(err);
//         }

//     }
// })
//// 꼬이는거 같아 잠시 봉인



//게시글 삭제, 주소에 넣을 걸 모르겠다
// app.delete("/?", async (req, res) => {
//     const {"찾기 기준"} = req.params;


// });


app.listen(4080, () => {
    console.log('포트로 서버가 열렸어요!');
});