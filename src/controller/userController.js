
const jwt = require("jsonwebtoken")
const { jwtConfig } = require("../config/config")

// 로그인 API 
const login = async (req, res) => {
    const { email, password } = req.body;
    const loginSql = `select * from users where email = "${email}" and password = "${password}";`
    connection.query(loginSql, (error, rows, fields) => {
        if (!rows[0]) {
            return res.status(400).json({ message: "email not found" });
        }
        const token = jwt.sign({ email: rows[0].email }, jwtConfig.secretKey, jwtConfig.options);
        res.cookie('jwt', token);
        console.log('jwt')
        res.json({ message: "wellcome" });
    })
}

//쿠키로 특정 사용자 정보를 가져오는 API (JWT)
const getUserInfos = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.json({ message: "for members only" }).redirect("/login")
    }
    const userToken = jwt.verify(req.cookies.jwt, jwtConfig.secretKey);
    const { email } = userToken
    connection.query(`select name, email from users where email = "${email}";`, (error, rows, fields) => {
        res.send(rows[0])
    })
}

const logout = async (req, res) => {
    res.clearcookie('jwt');
    res.redirect("/");
    //체감상 로그아웃 후 로그인/기본페이지가 맞는거 같아 그랬습니다
}
//https://recordofwonseok.tistory.com/214 참조함


// const signup = async (req, res) => {
//     const { name, email, password } = req.body

//     if (!email || !password || !name) {
//         return res.status(401).json({ message: "입력란 공백이 있습니다" })
//     }

    // const user = await checkEmail(email)
    //   if(user) {
    //     return res.status(401).json({message: "실패"})
    //   }
    //   await createEmail(name, email, password)
    //   res.json({message: "축하"})

// }


module.exports = { login, getUserInfos, logout }