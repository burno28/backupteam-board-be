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
// app.use(cors());

connection.connect();//node.js와 mysql을 실제 연결함

// //게시글 상위 10개 가져오는 API,
// app.get('/', (req, res) => {

//     const articles =  connection.query("select * from articles order by id desc")
//     const tenArticles = [articles]
//     res.send(tenArticles.splice(0, 10))
// })
app.listen(4080, () => {
    console.log(4080,'포트로 서버가 열렸어요!');
  });