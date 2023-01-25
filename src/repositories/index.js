const user = require("./userRepositories")
const article = require("./articleRepositories")

module.exports = {
  ...user,
  ...article
}