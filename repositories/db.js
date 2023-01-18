connection.query(sql, (error, rows, fields) => {     
    if (!email || password !== user.password) {
        res.status(400).send({
          errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
        })
        return
      }
    const token = jwt.sign({ name: user.name, email: user.email }, jwtConfig.secretKey, jwtConfig.options)
    res.cookie('user_token', token)
    console.log(token)})


    