const user = require("./userRepositories.js")
const article = require("./articleRepositories.js")

module.exports = {
  ...user,
  ...article
}