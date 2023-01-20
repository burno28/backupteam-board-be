const express = require('express');//사용하는 패키지
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const { query } = require('express');
const jwtConfig = require('./src/config/config.js');
const {corsOptions} = require("./src/config/config")
const articleRouter = require('./src/routes/articleRoutes')
const userRouter = require('./src/routes/userRoutes')


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// connection.connect();//node.js와 mysql을 실제 연결함

app.listen(4080, () => {
    console.log(4080,'포트로 서버가 열렸어요!');
  });