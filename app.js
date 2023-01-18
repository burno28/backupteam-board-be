const express = require('express');//사용하는 패키지
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const { query } = require('express');
const jwtConfig = require('./src/config/configuration.js');


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());


const connection = mysql.createConnection({
    host: "caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com",
    user: "sparta",
    password: "tmvkfmxk2022",
    database: "sparta_backup",
});

connection.connect();//node.js와 mysql을 실제 연결함

let corsOptions = {
    origin: 'http://localhost:3080',
    credentials: true
};


// 로그인 API 
app.post('/login', (req, res) => {
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

// //게시글 상위 10개 가져오는 API,
// app.get('/', (req, res) => {

//     const articles =  connection.query("select * from articles order by id desc")
//     const tenArticles = [articles]
//     res.send(tenArticles.splice(0, 10))
// })
app.get('/articles', (req, res) => {
    const { page } = req.query;
    const perPage = 3;//제 테이블 20개 칼럼이라 임시로 3
    const startIndex = ((page || 1) - 1) * perPage; //0111참조

    connection.query(`select count(*) from bongjin_articles_1`, (error, rows, fields) => {
        const lastPage = Math.ceil(rows[0].count / perPage)

        connection.query(`select * from bongjin_articles_1 order by id desc limit ${perPage} offset ${startIndex}`, (error, rows, fields) => {
            res.json({
                pageInfo: {
                    perPage,
                    lastPage,
                    currentPage: page || 1
                },
                rows
            });
        })
    })
})

//게시글 등록
app.post("/articles", (req, res) => {
    if (!req.cookies.jwt) {
        return res.json({ message: "for members only" });
    }
    const { title, contents } = req.body
    connection.query(`insert into bongjin_articles_1 (title, contents) values("${title}", "${contents}");`, () => {

        res.json({ message: "article is on air" })
    })
});

//게시글 수정기능
app.put('/articles/:id', (req, res) => {

    if (!req.cookies.jwt) {
      return res.status(401).json({message : "for members only"})
    }
    const { id } = req.params
    const {title, contents} = req.body
  
    connection.query(`update bongjin_articles_1 set title = "${title}" , contents = "${contents}" where id = ${id}`, (error, rows, fields) => {
  
    res.json({message: "수정 완료"})
    })
  });


//게시글 삭제, 주소에 넣을 걸 모르겠다
app.delete("/articles/:id", async (req, res) => {
    if (!req.cookies.jwt) {
        return res.status(401).json({ message: "로그인해주세요" })
    }
    const { id } = req.params
    connection.query(`delete from bongjin_articles_1 where id = "${id}"`, (error, rows, fields) => {
        res.json("삭제 완료")
    })
});

// app.listen(process.env.PORT, () => {
//     console.log(process.env.PORT, '포트로 서버가 열렸어요!');
//   });

app.listen(4080, () => {
    console.log(4080,'포트로 서버가 열렸어요!');
  });