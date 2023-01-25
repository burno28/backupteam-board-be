const express = require('express')//사용하는 패키지
const cors = require('cors')
const cookieParser = require('cookie-parser')

const {corsOptions} = require("./src/config/config")
const articleRouter = require('./src/routes/articleRoutes')
const userRouter = require('./src/routes/userRoutes')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use("/articles", articleRouter)
app.use(userRouter)

require('dotenv').config()

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT, '포트로 서버가 열렸어요!')
  })
  
  
  // const jwt = require('jsonwebtoken');
// const mysql = require('mysql2');
// const { query } = require('express');
// const jwtConfig = require('./src/config/config.js');