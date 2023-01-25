let conn
require("./connect.js").then((a) => {
  conn = a
})


const findOne = async (table, [conditions]) => {
  const conditionString = Object.keys(conditions).map(field => `${field} = ?`).join(" and ")
  const [result] = await conn.execute(`select * from ${table} where ${conditionString}`,Object.values(conditions))
  if (!result.length) {
    throw new Error('not found user')
  }
  return result[0]
}

const findByPk = async (table, condition) => {
  const key = Object.key || "id"
  const [rows] = await conn.execute(`select * from ${table} where ${pk} = ?`, [value])
  if(!rows.length) {
    throw new Error("Not Found")
  }
  return rows[0]
}

const findAll = async (table, conditions) => {
    const conditionString =Object.keys(conditions).map(field => `${field} = ?`).join(" and ")
    const [result] = await conn.execute(`select * from ${table} where ${conditionString}`,Object.values(conditions))
    if (!result.length) {
        throw new Error('Not found')
    }
    return result
}

//// find all까지 따라쳤는데 필요없데서 멘붕
// const connection = require("./connect");

// let conn = null
// connection().then(mysqlConn => {
//   conn = mysqlConn
//   console.log(conn)
// })

// connection.query(sql, (error, rows, fields) => {     
//     if (!email || password !== user.password) {
//         res.status(400).send({
//           errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
//         })
//         return
//       }
//     const token = jwt.sign({ name: user.name, email: user.email }, jwtConfig.secretKey, jwtConfig.options)
//     res.cookie('user_token', token)
//     console.log(token)})
module.exports = {findOne, findByPk, findAll}
