const { email, password } = req.body
const sql = `select * from users where email = "${email}" and password = "${password}"`
connection.query(sql, (error, rows, fields) => {     
    
    if (!rows[0]) {
        res.status(404).json({
            errorMessage: '로그인 정보가 틀렸습니다.'
        })
    }
    const token = jwt.sign(rows[0], jwtConfig.secretKey, jwtConfig.options)
    res.cookie('user_token', token)
    // console.log(req.cookies)
    // res.send({ result: true })\
    res.send(rows[0])
})

app.post('/login', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/');
                response.end();
            } else {              
                response.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/login";</script>');    
            }            
        });
    } else {        
        response.send('<script type="text/javascript">alert("username과 password를 입력하세요!"); document.location.href="/login";</script>');    
        response.end();
    }
});