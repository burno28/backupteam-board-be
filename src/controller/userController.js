
const jwt = require("jsonwebtoken")
const { jwtConfig } = require("../config/config")
const {getUserByEmailAndPassword,getUserInfo,checkEmail, createEmail,myposts} = require("../repositories/index")

// const sequelize = require("../repositories/connect")

// 로그인 API 
const login = async (req, res) => {
    const { email, password } = req.body

        const user = await getUserByEmailAndPassword(email, password)
        if(!user) {
            return res.status(404).send({ message: "로그인 실패, 3초뒤 로그인 페이지로 이동합니다" })
            // .setTimeout(() => {
            //     redirect("/login");
            // }, 3000);
        }
        res.cookie("jwt", jwt.sign({id: user.id}, jwtConfig.secretKey, jwtConfig.options))
        res.status(200).json({message: "wellcome back"})

    // const loginSql = `select * from users where email = "${email}" and password = "${password}";`
    // sequelize.query(loginSql, (error, rows, fields) => {
    //     if (!rows[0]) {
    //         return res.status(400).json({ message: "email not found" });
    //     }
    //     const token = jwt.sign({ email: rows[0].email }, jwtConfig.secretKey, jwtConfig.options);
    //     res.cookie('jwt', token);
    //     console.log('jwt')
    //     res.json({ message: "wellcome" });
    // })
}

//쿠키로 특정 사용자 정보를 가져오는 API (JWT)
const getUserInfos = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.json({ message: "for members only" })
        // .redirect("/login")
    }
    const {id} = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)

    const userInfo = await getUserInfo(id)
    const myArticles = await myposts(id)
    res.json({userInfo, myArticles})
    // const userToken = jwt.verify(req.cookies.jwt, jwtConfig.secretKey);
    // const { email } = userToken
    // connection.query(`select name, email from users where email = "${email}";`, (error, rows, fields) => {
    //     res.send(rows[0])
    // })
}

const logout = async (req, res) => {
    res.clearCookie('jwt')
    res.end()
    // res.redirect("/")
    //체감상 로그아웃 후 로그인/기본페이지가 맞는거 같아 그랬습니다
}
//https://recordofwonseok.tistory.com/214 참조함

const signup = async (req,res) => {
    const {name, email, password, confirm} = req.body
    
    const user = await checkEmail(email)
    if(password !== confirm) {
      return res.status(500).json({notSame: "비밀번호가 틀립니다"})
    }
      if(user) {
        return res.status(401).json({alreadyEmail: "이미 가입된 이메일 입니다."})
      }
      await createEmail(name, email, password)
      res.json({message: "회원가입을 축하드립니다"})
  }
  



module.exports = { login, getUserInfos, logout, signup }