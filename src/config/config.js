const jwtConfig = {
    secretKey: "secretKey",//시크렛키
    options: {
        algorithm: "HS256",//상황보고 주석화
        expiresIn: "15m",//1분짧더라
        issuer: "bongjin"//발행자
    }
}//jwt 쓰기
const corsOptions = {
    origin: 'http://localhost:3080',
    credentials: true
};

module.exports = {jwtConfig,corsOptions}