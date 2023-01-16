app.post('/login', (req, res) => {

    // email, password 받아서 해당하는 유저가 존재하는지 확인
    // const { email, password } = req.body        
    //connection.query(`select * from users where email = ? and password =?`, [email,password], function(error, results, fields) {}
    //     )
    const { email, password } = req.body
    const user = users.find(user => user.email === email)

    if (!user) {
        res.status(404).json({
            errorMessage: '해당 아이디가 없습니다.'
        })
    }

    if (user.password !== password) {
        res.status(404).json({
            errorMessage: '비번이 틀렸습니다.'
        })
    }

    const token = jwt.sign({ name: user.name, id: user.id }, jwtConfig.secretKey, jwtConfig.options)
    res.cookie('jwt', token)
    console.log(req.cookies)
    res.send({ result: true })
})